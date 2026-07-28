export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method tidak diizinkan' });
    return;
  }

  try {
    const { password, hari } = req.body || {};
    const adminPassword = process.env.ADMIN_PASSWORD;
    const secret = process.env.ACCESS_SECRET;

    if (!adminPassword || !secret) {
      res.status(500).json({ error: 'ADMIN_PASSWORD atau ACCESS_SECRET belum diatur di Vercel' });
      return;
    }

    if (!password || password.trim() !== adminPassword.trim()) {
      res.status(403).json({ error: 'Password admin salah.' });
      return;
    }

    const { generateCode } = require('./_accessCode.js');
    const hariBerlaku = hari && Number(hari) > 0 ? Number(hari) : 30;
    const { kode, expiryDate } = generateCode(secret, hariBerlaku);

    const expiryStr = expiryDate.toLocaleDateString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric'
    });

    res.status(200).json({ kode, kadaluarsa: expiryStr, hariBerlaku });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Terjadi kesalahan di server' });
  }
}
