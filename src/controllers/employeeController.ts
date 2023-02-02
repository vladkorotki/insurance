import { Request, Response } from "express";
import {
  employeeRepository,
  userRepository,
} from "../repositiries/repositories";
import { Message } from "../shared/enums/enums-message";
import logger from "../../logger";
import { HttpStatusCode } from "../shared/enums/enum-httpStatusCode";
import relationObject from "../shared/relations/relations";

class EmployeeController {
  async getAll(req: Request, res: Response) {
    try {
      const data = await employeeRepository.find({
        // relations: { consumer: true },
        relations: ["consumer", "consumer.claims"],
      });
      res.status(HttpStatusCode.Ok).json(data);
    } catch (error) {
      logger.info(error.detail);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }


  async getEmployer(req: Request, res: Response) {
    const {id} = req.params
    try {
      const data = await employeeRepository.findOne({
        // relations: { consumer: true },
        relations: ["consumer", "consumer.claims"],
        where:{
          id
        }
      });
      res.status(HttpStatusCode.Ok).json(data);
    } catch (error) {
      logger.info(error.detail);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { userName } = req.body;
      const deletedUser = await employeeRepository.delete({
        name: userName,
      });

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

  

  async deleteAll(req: Request, res: Response) {
    try {
      await employeeRepository.delete({});
      res.status(HttpStatusCode.Ok).json(Message.okResponse);
    } catch (error) {
      logger.error(error.detail);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async updateEmployerData(req: Request, res: Response) {
    try {
      const { user, id } = req.body;

      const employer = await employeeRepository.findOne({
        where: { id },
      });

      employeeRepository.merge(employer, { ...user });
      await employeeRepository.save(employer);

      return res.status(HttpStatusCode.Ok).json(Message.updateData);
    } catch (error) {
      logger.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async getEmployersAmount(req: Request, res: Response) {
    try {
      const employers = await employeeRepository.find({
    
      });
      const amountEmployers = employers.length;
      res.status(HttpStatusCode.Ok).json(amountEmployers);
    } catch (error) {
      logger.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }
}

export const employeeController = new EmployeeController();
