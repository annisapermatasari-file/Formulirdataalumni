const crypto = require('crypto');

const DURASI_MS = 8 * 60 * 60 * 1000; // sesi 8 jam

function secret() {
  return process.env.SESSION_SECRET || '';
}

function buatToken() {
  const exp = String(Date.now() + DURASI_MS);
  const sig = crypto.createHmac('sha256', secret()).update(exp).digest('hex');
  return exp + '.' + sig;
}

function tokenValid(token) {
  if (!token || !secret()) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig) return false;
  const expected = crypto.createHmac('sha256', secret()).update(exp).digest('hex');
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  return Date.now() < Number(exp);
}

function getCookie(req, name) {
  const m = (req.headers.cookie || '').match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return m ? m[1] : null;
}

function requireAdmin(req, res) {
  if (!tokenValid(getCookie(req, 'admin_session'))) {
    res.status(401).json({ message: 'Belum login' });
    return false;
  }
  return true;
}

module.exports = { buatToken, tokenValid, getCookie, requireAdmin };
