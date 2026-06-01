exports.handler = async function(event, context) {
  if (event.httpMethod === 'GET') {
    return { statusCode: 200, body: 'Hello API Event Received' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 200, body: 'Hello API Event Received' };
  }
  try {
    const body = event.body || '';
    let data;
    try {
      const params = new URLSearchParams(body);
      const jsonStr = params.get('json');
      data = jsonStr ? JSON.parse(jsonStr) : JSON.parse(body);
    } catch(e) {
      data = JSON.parse(body);
    }

    const eventType = data?.event?.event_type;
    console.log('HelloSign event:', eventType);

    const appsScriptUrl = process.env.APPS_SCRIPT_URL;
    if (appsScriptUrl) {
      try {
        await fetch(appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          redirect: 'follow'
        });
      } catch(e) {
        console.error('Forward error:', e.message);
      }
    }

    return { statusCode: 200, body: 'Hello API Event Received' };
  } catch(err) {
    console.error('Error:', err.message);
    return { statusCode: 200, body: 'Hello API Event Received' };
  }
};
