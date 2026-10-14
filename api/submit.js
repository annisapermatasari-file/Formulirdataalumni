const { sql, ensureTable } = require('../lib/db');

const txt = v => (v === undefined || v === null || String(v).trim() === '') ? null : String(v).trim();
const num = v => (v === undefined || v === null || String(v).trim() === '') ? null : Number(v);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  const d = req.body || {};

  if (!/^\d{16}$/.test(String(d.nik || ''))) {
    return res.status(400).json({ status: 'error', message: 'NIK harus 16 digit angka' });
  }
  if (!txt(d.nama)) {
    return res.status(400).json({ status: 'error', message: 'Nama wajib diisi' });
  }
  if (!/^\d{9,15}$/.test(String(d.telepon || ''))) {
    return res.status(400).json({ status: 'error', message: 'Nomor telepon wajib diisi (9-15 digit angka)' });
  }
  if (!['PKW', 'PKK', 'MANDIRI'].includes(d.tipeProgram)) {
    return res.status(400).json({ status: 'error', message: 'Tipe program tidak valid' });
  }

  const wajib = ['jenisKelamin', 'tanggalLahir', 'pendidikanTerakhir', 'provinsi',
    'kabupatenKota', 'tipeProgram', 'tahunBantuan', 'jenisKeterampilan', 'statusPeserta'];
  if (wajib.some(k => !txt(d[k]))) {
    return res.status(400).json({ status: 'error', message: 'Ada data wajib yang belum diisi' });
  }

  const isAlumni = d.statusPeserta === 'Lulusan / Alumni';
  if (isAlumni && (!txt(d.asalLKP) || !txt(d.tahunLulus))) {
    return res.status(400).json({ status: 'error', message: 'Asal LKP dan tahun lulus wajib diisi' });
  }

  try {
    await ensureTable();
    await sql`
      INSERT INTO peserta (
        nik, nama, jenis_kelamin, tanggal_lahir, telepon, pendidikan_terakhir,
        provinsi, kabupaten_kota, tipe_program, tahun_bantuan, jenis_keterampilan,
        status_peserta, asal_lkp, tahun_lulus, no_sertifikat, status_bekerja,
        negara_tujuan, nama_tempat_industri, pekerjaan_negara_tujuan
      ) VALUES (
        ${d.nik}, ${txt(d.nama)}, ${txt(d.jenisKelamin)}, ${txt(d.tanggalLahir)},
        ${txt(d.telepon)}, ${txt(d.pendidikanTerakhir)}, ${txt(d.provinsi)},
        ${txt(d.kabupatenKota)}, ${txt(d.tipeProgram)}, ${num(d.tahunBantuan)},
        ${txt(d.jenisKeterampilan)}, ${txt(d.statusPeserta)}, ${txt(d.asalLKP)},
        ${num(d.tahunLulus)}, ${txt(d.noSertifikat)}, ${txt(d.statusBekerja)},
        ${txt(d.negaraTujuan)}, ${txt(d.namaTempatIndustri)}, ${txt(d.pekerjaanNegaraTujuan)}
      )
    `;
    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ status: 'duplikat', message: 'NIK sudah terdaftar' });
    }
    return res.status(500).json({ status: 'error', message: 'Gagal menyimpan data' });
  }
};
