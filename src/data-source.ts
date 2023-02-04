import "reflect-metadata";
import { DataSource } from "typeorm";
import { Admin } from "./entity/Admin";
import { Consumer } from "./entity/Consumer";
import { Employee } from "./entity/Employee";
import { User } from "./entity/User";
import * as dotenv from "dotenv";
import { Role } from "./entity/Role";
import { Plans } from "./entity/Plans";
import {Claims} from "./entity/Claims"

dotenv.config();

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   // host: process.env.DB_G_HOST,
//   host:"localhost",
//   port: 5432,
//   username: process.env.DB_USER_NAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   synchronize: true,
//   logging: false,
//   entities: [User, Admin, Employee, Consumer, Role, Plans, Claims],
//   migrations: [],
//   subscribers: [],
//   // ssl: {
//   //   rejectUnauthorized: false,
//   // },
// });
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_G_HOST,
  port: 10269,
  username: process.env.DB_G_USER_NAME,
  password: process.env.DB_G_PASSWORD,
  database: process.env.DB_G_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Admin, Employee, Consumer, Role, Plans, Claims],
  migrations: [],
  subscribers: [],
  ssl: {
    rejectUnauthorized: false,
  },
});
// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: "postgresql-108911-0.cloudclusters.net",
//   port: 10269,
//   username: "admin",
//   password: "rdvuiewPRO92",
//   database: "insurance_db",
//   synchronize: true,
//   logging: false,
//   entities: [User, Admin, Employee, Consumer, Role, Plans, Claims],
//   migrations: [],
//   subscribers: [],
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

