export default async function handleSearch(req,res) {
    const {name} = req.query;

    if(req.method === "GET" && name){
        try{
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=4`);

            if(!response.ok){
                throw new Error("Failed to fetch data!");
            }
            
            const data = await response.json();
            res.status(200).json(data.results || []);
        } catch(error){
            console.error("Error fetching city data:", error);
            res.status(500).json({error: "Failed to fetch city data!"});
        }
    }
    else{
        res.status(400).json({error: "City name parameter is required."});
    }
}