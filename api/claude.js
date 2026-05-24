export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const apiKey = req.headers['x-api-key'] || req.body?.apiKey;
  
  if (!apiKey) {
    return res.status(401).json({ error: { message: 'No API key provided' } });
  }

  try {
    const { apiKey: _, ...bodyWithoutKey } = req.body || {};
    const payload = bodyWithoutKey.model ? bodyWithoutKey : req.body;
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
}
