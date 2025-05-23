// server/server.js
require('dotenv').config();
const axios = require('axios');

exports.handler = async (event) => {
  try {
    const city = event.queryStringParameters.city;
    if (!city) throw new Error('City parameter is required');
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};