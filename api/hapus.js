const { sql } = require('../lib/db');
const { requireAdmin } = require('../lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  if (!requireAdmin(req, res)) return;

  const id = Number(req.body && req.body.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: 'ID peserta tidak valid' });
  }

  try {
    const { rows } = await sql`DELETE FROM peserta WHERE id = ${id} RETURNING id`;
    if (!rows.length) {
      return res.status(404).json({ message: 'Data peserta tidak ditemukan' });
    }
    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    return res.status(500).json({ message: 'Gagal menghapus data peserta' });
  }
};