export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method tidak diizinkan' });
    return;
  }

  try {
    const { prompt, kode } = req.body || {};
    if (!prompt) {
      res.status(400).json({ error: 'Prompt kosong' });
      return;
    }

    const accessCode = process.env.ACCESS_CODE;
    if (accessCode) {
      if (!kode || kode.trim() !== accessCode.trim()) {
        res.status(403).json({ error: 'Kode akses salah atau belum diisi.' });
        return;
      }
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'ANTHROPIC_API_KEY belum diatur di Vercel Environment Variables' });
      return;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: data.error?.message || 'Gagal memanggil AI' });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Terjadi kesalahan di server' });
  }
}
