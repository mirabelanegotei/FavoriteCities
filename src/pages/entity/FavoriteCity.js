import { EntitySchema } from "typeorm";

const Favorite = new EntitySchema({
  name: "Favorite",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    cityName: {
      type: "varchar",
      length: 255,
    },
    lat: {
      type: "float",
    },
    long: {
      type: "float",
    },
    population: {
      type: "int",
    },
    elevation: {
      type: "int",
    },
    timezone: {
      type: "varchar",
      length: 255,
    },
  },
  relations: {
      users: {
        type: "many-to-many",  
        target: "User",
        mappedBy: "favorites", 
      },
  },

});

export default Favorite;