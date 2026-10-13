const { sql } = require('@vercel/postgres');

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS peserta (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      nik VARCHAR(16) UNIQUE NOT NULL,
      nama TEXT NOT NULL,
      jenis_kelamin VARCHAR(1),
      tanggal_lahir DATE,
      telepon VARCHAR(20),
      pendidikan_terakhir TEXT,
      provinsi TEXT,
      kabupaten_kota TEXT,
      tipe_program VARCHAR(10),
      tahun_bantuan INT,
      jenis_keterampilan TEXT,
      status_peserta TEXT,
      asal_lkp TEXT,
      tahun_lulus INT,
      no_sertifikat TEXT,
      status_bekerja TEXT,
      negara_tujuan TEXT,
      pekerjaan_negara_tujuan TEXT
    )
  `;
}

module.exports = { sql, ensureTable };
