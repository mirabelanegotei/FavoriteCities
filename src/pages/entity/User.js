import {EntitySchema } from "typeorm";

const User = new EntitySchema({
  name: "User",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    username: {
      type: "varchar",
    },
    email: {
      type: "varchar",
    },
    password: {
      type: "varchar",
    },
  },
});

export default User;