import { Request, Response } from "express";
import { Admin } from "../entity/Admin";
import { Consumer } from "../entity/Consumer";
import { Employee } from "../entity/Employee";
import { User } from "../entity/User";
import { responseUserObject } from "../helpers/responseUser";
import {
  adminRepository,
  consumerRepository,
  employeeRepository,
  plansRepository,
  roleRepository,
  userRepository,
} from "../repositiries/repositories";
import { Message } from "../shared/enums/enums-message";
import logger from "../../logger";
import { HttpStatusCode } from "../shared/enums/enum-httpStatusCode";
import { DataReq } from "../shared/types/types";
import { IsNull, Like, Not } from "typeorm";
import relationObject from "../shared/relations/relations";

const deletedProps = [
  // "accessToken",
  "refreshToken",
  "hashPassword",
  "password",
];

class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { password, role, data, login = data.login }: DataReq = req.body;

      const checkedRole = await roleRepository.findOneBy({ roleName: role });
      if (!checkedRole) {
        return res
          .status(HttpStatusCode.InternalServerError)
          .json(Message.errorResponse);
      }
      const checkedUser = await userRepository.find({
        where: {
          login: login,
        },
      });

      if (checkedUser.length) {
        return res
          .status(HttpStatusCode.InternalServerError)
          .json(Message.existsUser);
      }

      const user = new User(login, password);
      user.role = checkedRole;
      user.hashPassword();

      if (role == "employer") {
        const employee = new Employee(data);
        await employeeRepository.save(employee);
        user.employee = employee;
      }

      if (role == "admin") {
        const admin = new Admin(data);
        await adminRepository.save(admin);
        user.admin = admin;
      }

      if (role == "consumer") {
        const foundEmployer = await employeeRepository.findOne({
          where: {
            userLogin: data.employer,
          },
          relations: ["consumer"],
        });

        if (!foundEmployer) {
          return res
            .status(HttpStatusCode.InternalServerError)
            .json(Message.conpamyNotFound);
        }
        const consumer = new Consumer(data);
        await consumerRepository.save(consumer);
        user.consumer = consumer;
        employeeRepository.merge(foundEmployer, {
          consumer: [...foundEmployer.consumer, consumer],
        });

        await employeeRepository.save(foundEmployer);
      }
      await userRepository.save(user);
      res.status(HttpStatusCode.Ok).json(Message.successUserCreate);
    } catch (error) {
      logger.error(error.detail);
      res.status(HttpStatusCode.InternalServerError).json(Message.existsUser);
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const allUsers = await userRepository.find({
        relations: [
          "plans",
          "role",
          "employee",
          "employee.consumer",
          "admin",
          "consumer",
          "consumer.employee",
          "employee.consumer.claims",
        ],
      });

      const result = allUsers.map((user) =>
        responseUserObject(user, deletedProps)
      );
      res.status(HttpStatusCode.Ok).json(result);
      // res.status(HttpStatusCode.Ok).json(allUsers);
    } catch (error) {
      logger.error(error.detail);
      res.status(HttpStatusCode.InternalServerError).json(error);
    }
  }

  async deleteUser(req: Request, res: Response) {
    let deletedUser = null;
    try {
      const { id } = req.body;
      const foundUserAdmin = await userRepository.findOne({
        relations: [
          "plans",
          "role",
          "employee",
          "employee.consumer",
          "admin",
          "consumer",
          "consumer.employee",
        ],
        where: {
          role: {
            roleName: "admin",
          },
          admin: {
            id: id,
          },
        },
      });

      const foundUserEmployer = await userRepository.findOne({
        relations: [
          "plans",
          "role",
          "employee",
          "employee.consumer",
          "admin",
          "consumer",
          "consumer.employee",
        ],
        where: {
          role: {
            roleName: "employer",
          },
          employee: {
            id: id,
          },
        },
      });

      const foundUserConsumer = await userRepository.findOne({
        relations: [
          "plans",
          "role",
          "employee",
          "employee.consumer",
          "admin",
          "consumer",
          "consumer.employee",
        ],
        where: {
          role: {
            roleName: "consumer",
          },
          consumer: {
            id: id,
          },
        },
      });

      if (foundUserAdmin) {
        const plans = foundUserAdmin.plans;
        await plansRepository.remove(plans);

        deletedUser = await adminRepository.delete({
          id: id,
        });
      }

      if (foundUserConsumer) {
        const plans = foundUserConsumer.plans;
        await plansRepository.remove(plans);
        deletedUser = await consumerRepository.delete({
          id: id,
        });
      }

      if (foundUserEmployer) {
        const plans = foundUserEmployer.plans;
        await plansRepository.remove(plans);
        deletedUser = await employeeRepository.delete({
          id: id,
        });
      }

      res
        .status(HttpStatusCode.Ok)
        .json({ message: `Count of deleted users: ${deletedUser.affected}` });
    } catch (error) {
      logger.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async deleteAllUsers(req: Request, res: Response) {
    try {
      await userRepository.delete({});
      res.status(HttpStatusCode.Ok).json(Message.deleteUser);
    } catch (error) {
      logger.error(error.detail);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async getEmployers(req: Request, res: Response) {
    try {
      let count = +req.query.skip;
      let countryCode: any = req.query.countryCode;
      let name: any = req.query.employerName;
      let sortByName: any = req.query.sortByName;
      let sortByCode: any = req.query.sortByCode;

      const byName = function (): any {
        if (sortByName === "true") return "ASC";
      };

      const byCode = function (): any {
        if (sortByCode === "true") return "ASC";
      };

      const employers = await userRepository.find({
        relations: relationObject,
        where: {
          employee: {
            id: Not(IsNull()),
            countryCode: Like(`%${countryCode}%`),
            name: Like(`%${name}%`),
          },
        },

        skip: (count - 1) * 10,
        take: 10,

        order: {
          employee: {
            name: byName(),
            countryCode: byCode(),
          },
        },
      });

      const result = employers.map((item) => item.employee);
      res.status(HttpStatusCode.Ok).json(result);
    } catch (error) {
      logger.error(error.detail);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }
}
export const userController = new UserController();
