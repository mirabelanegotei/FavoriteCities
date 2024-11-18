import { DataSource } from "typeorm";
import User from "@/pages/entity/User"; 

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "databases/favcities", 
  synchronize: true, 
  logging: true,
  entities: [User],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
  
export default AppDataSource;