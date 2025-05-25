const fetch = require('node-fetch');

exports.handler = async function(event) {
  const city = event.queryStringParameters.city;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!city || !apiKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing city or API key" })
    };
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "City not found" })
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
};
