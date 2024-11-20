import { DataSource } from "typeorm";
import User from "@/pages/entity/User"; 
import FavoriteCity from "@/pages/entity/FavoriteCity";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "databases/favcities", 
  synchronize: true, 
  logging: true,
  entities: [User, FavoriteCity],
  synchronize: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
  
export default AppDataSource;