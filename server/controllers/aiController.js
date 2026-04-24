const getDestinationSuggestions = async (req, res) => {
  const { destination } = req.body;
  if (!destination) {
    return res.status(400).json({ success: false, message: 'Destination is required' });
  }

  const endpoint = process.env.AZURE_AI_ENDPOINT;
  const apiKey   = process.env.AZURE_AI_KEY;

  const body = JSON.stringify({
    messages: [
      { role: 'system', content: 'You are a friendly local guide. Give concise, useful suggestions.' },
      { role: 'user', content: `I'm taking a rideshare to "${destination}". Suggest 4-5 fun things to do, see, or eat near this destination. Keep each item to one short sentence. Format as a numbered list.` },
    ],
    max_tokens: 400,
    temperature: 0.7,
  });

  const urlsToTry = [
    `${endpoint}/chat/completions?api-version=2024-05-01-preview`,
    `${endpoint}/chat/completions?api-version=2025-01-01-preview`,
    `${endpoint}/completions?api-version=2024-05-01-preview`,
  ];

  for (const url of urlsToTry) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        body,
      });

      const raw = await response.text();
      console.log(`Azure AI [${response.status}] ${url}:`, raw.slice(0, 300));

      if (!response.ok) continue;

      const data = JSON.parse(raw);
      const suggestions = data.choices?.[0]?.message?.content?.trim() || '';
      return res.json({ success: true, suggestions });
    } catch (err) {
      console.error('Fetch error for', url, err.message);
    }
  }

  res.status(502).json({ success: false, message: 'AI service unavailable — check Render logs for Azure error details' });
};

module.exports = { getDestinationSuggestions };