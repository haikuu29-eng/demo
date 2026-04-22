// VTH OmgevingsCheck — AI Proxy (Netlify Function)
// Stuurt het verzoek door naar de Anthropic API en lost het CORS-probleem op.

exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = event.headers['x-api-key'];
  if (!apiKey) {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Geen API-key meegestuurd' }) };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':                    'application/json',
        'x-api-key':                       apiKey,
        'anthropic-version':               event.headers['anthropic-version'] || '2023-06-01',
        'anthropic-dangerous-allow-browser': 'true',
      },
      body: event.body,
    });

    const body = await response.text();
    return { statusCode: response.status, headers: cors, body };
  } catch (err) {
    return { statusCode: 502, headers: cors, body: JSON.stringify({ error: 'Proxyfout: ' + err.message }) };
  }
};
