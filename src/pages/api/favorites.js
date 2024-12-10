import dataSource from "../../../data-source";
import Favorite from "@/pages/entity/FavoriteCity"; 
import User from "@/pages/entity/User";

const userRepository = dataSource.getRepository(User);
const cityRepository = dataSource.getRepository(Favorite);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, cityName, lat, long, pop, elev, timez } = req.body;

    if (!userId || !cityName || !lat || !long) {
      return res.status(400).json({ message: "Missing required data." });
    }

    try {
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ["favorites"], 
      });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const newFavorite = cityRepository.create({
        cityName,
        lat,
        long,
        population: pop,
        elevation: elev,
        timezone: timez,
      });

      const savedCity =  await cityRepository.save(newFavorite);
      user.favorites = [...(user.favorites || []), savedCity];

      await userRepository.save(user);
      return res.status(200).json({ message: "City added to favorites!" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to add to favorites." });
    }
  }  else if (req.method === "GET") {
    const { userId } = req.query; 

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    try {
      if(!dataSource.isInitialized){
        await dataSource.initialize();
      }
      const favorites = await userRepository.findOne({
        where: { id: Number(userId) }, 
        relations: ['favorites'], 
      });

      if (!favorites || favorites.length === 0) {
        return res.status(404).json({ message: "No favorite cities found for this user." });
      }

      return res.status(200).json(favorites);  
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch favorite cities." });
    }
  }
  else if (req.method === "DELETE") {
    const { userId, cityName } = req.body;

    if (!userId || !cityName) {
      return res.status(400).json({ message: "User ID and city name are required." });
    }

    try {
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ["favorites"],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const cityIndex = user.favorites.findIndex(fav => fav.cityName === cityName);

      if (cityIndex === -1) {
        return res.status(404).json({ message: "City not found in favorites." });
      }

      user.favorites.splice(cityIndex, 1);

      await userRepository.save(user);

      return res.status(200).json({ message: `${cityName} removed from favorites.` });
    } catch (error) {
      return res.status(500).json({ message: "Failed to remove from favorites." });
    }
  }
  else {
    return res.status(405).json({ message: "Method not allowed." });
  }
}