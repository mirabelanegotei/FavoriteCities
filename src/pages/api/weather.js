export default async function handler(req, res) {
    const { lat, long } = req.query;
  
    if (!lat || !long) {
      return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }
  
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant,uv_index_max`;
  
    try {
      const response = await fetch(weatherUrl);
      const data = await response.json();
  
      if (data && data.daily) {
        res.status(200).json(data.daily);
      } else {
        res.status(404).json({ error: 'Weather data not available for this location' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch weather data' });
    }
  }