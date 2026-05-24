export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ElevenLabs key not configured' });

  try {
    const { text, voice_id } = req.body;
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id || '21m00Tcm4TlvDq8ikWAM'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text.slice(0, 2500),
        model_id: 'eleven_monolingual_v1',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
      })
    });
    if (!response.ok) throw new Error('ElevenLabs error: ' + response.status);
    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
