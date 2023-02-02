import { AppDataSource } from "../data-source";
import { Admin } from "../entity/Admin";
import { Claims } from "../entity/Claims";
import { Consumer } from "../entity/Consumer";
import { Employee } from "../entity/Employee";
import { Plans } from "../entity/Plans";
import { Role } from "../entity/Role";
import { User } from "../entity/User";

export const userRepository = AppDataSource.getRepository(User);
export const roleRepository = AppDataSource.getRepository(Role);
export const employeeRepository = AppDataSource.getRepository(Employee);
export const adminRepository = AppDataSource.getRepository(Admin);
export const consumerRepository = AppDataSource.getRepository(Consumer);
export const plansRepository = AppDataSource.getRepository(Plans);
export const claimsRepository = AppDataSource.getRepository(Claims)