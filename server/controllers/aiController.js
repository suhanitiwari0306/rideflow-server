const getDestinationSuggestions = async (req, res) => {
  const { destination } = req.body;
  if (!destination) {
    return res.status(400).json({ success: false, message: 'Destination is required' });
  }

  const endpoint = process.env.AZURE_AI_ENDPOINT;
  const apiKey   = process.env.AZURE_AI_KEY;

  try {
    const response = await fetch(
      `${endpoint}/chat/completions?api-version=2025-01-01-preview`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a friendly local guide. Give concise, useful suggestions.',
            },
            {
              role: 'user',
              content: `I'm taking a rideshare to "${destination}". Suggest 4-5 fun things to do, see, or eat near this destination. Keep each item to one short sentence. Format as a numbered list.`,
            },
          ],
          max_tokens: 400,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Azure AI error:', response.status, err);
      return res.status(502).json({ success: false, message: 'AI service unavailable' });
    }

    const data = await response.json();
    const suggestions = data.choices?.[0]?.message?.content?.trim() || '';
    res.json({ success: true, suggestions });
  } catch (err) {
    console.error('AI request failed:', err);
    res.status(500).json({ success: false, message: 'Failed to get suggestions' });
  }
};

module.exports = { getDestinationSuggestions };