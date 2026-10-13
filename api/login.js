const { buatToken } = require('../lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { password } = req.body || {};
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Password salah' });
  }

  res.setHeader(
    'Set-Cookie',
    `admin_session=${buatToken()}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`
  );
  return res.status(200).json({ status: 'ok' });
};
