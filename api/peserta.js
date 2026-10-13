const { sql, ensureTable } = require('../lib/db');
const { requireAdmin } = require('../lib/auth');

module.exports = async (req, res) => {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    await ensureTable();
    const { rows } = await sql`SELECT * FROM peserta ORDER BY created_at DESC LIMIT 10000`;
    return res.status(200).json({ rows });
  } catch (err) {
    return res.status(500).json({ message: 'Gagal mengambil data' });
  }
};
