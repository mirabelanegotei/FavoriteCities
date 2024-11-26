
const calculateViewbox = (lat, lon, radiusKm = 500) => {
    const EARTH_RADIUS_LAT = 100; // km per degree of latitude

    const latOffset = radiusKm / EARTH_RADIUS_LAT;
    const lonOffset = radiusKm / (EARTH_RADIUS_LAT * Math.cos(lat * Math.PI / 180));

    const north = lat + latOffset;
    const south = lat - latOffset;
    const east = lon + lonOffset;
    const west = lon - lonOffset;

    return {
        north: north.toFixed(6),
        south: south.toFixed(6),
        east: east.toFixed(6),
        west: west.toFixed(6)
    };
}

export default async function handler(req, res) {
    try {
        const {latitude, longitude} = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({error: "Latitude and Longitude are required."});
        }

        const radius = 500;

        const viewbox = calculateViewbox(Number(latitude), Number(longitude), radius);

        const viewboxStr = `${viewbox.west},${viewbox.north},${viewbox.east},${viewbox.south}`;

        const url = `https://nominatim.openstreetmap.org/search?q=city&format=json&addressdetails=1&viewbox=${viewboxStr}&bounded=1&limit=50`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({error: "Failed to fetch cities."});
        }

        if (data.length === 0) {
            return res.status(404).json({error: "No cities found nearby."});
        }

        const filteredResponse = data.filter(el => el.type === 'city');

        const randomCities = [];
        while (randomCities.length < 5 && filteredResponse.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredResponse.length);
            randomCities.push(filteredResponse.splice(randomIndex, 1)[0]);
        }

        const randomCitiesMapped = randomCities.map(el => ({
            ...el,
            cityName: el.name,
            long: el.lon,
            country: el.address?.country
        }))

        res.status(200).json(randomCitiesMapped);  // Return the 5 random cities
    } catch (error) {
        console.error("Error fetching nearby cities:", error);
        res.status(500).json({error: "Failed to fetch nearby cities."});
    }
}
