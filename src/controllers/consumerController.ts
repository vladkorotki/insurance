import { Request, Response } from "express";
import { consumerRepository } from "../repositiries/repositories";
import { HttpStatusCode } from "../shared/enums/enum-httpStatusCode";
import { Message } from "../shared/enums/enums-message";

import logger from "../../logger";
import { Like } from "typeorm";
import { futimesSync } from "fs";
class ConsumerController {
  async getAllConsumers(req: Request, res: Response) {
    try {
      const data = await consumerRepository.find({
        relations: ["employee", "claims"],
      });

      res.status(HttpStatusCode.Ok).json(data);
    } catch (error) {
      logger.error(error.detail);

      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async getAllAdminsConsumers(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const adminsConsumers = await consumerRepository.find({
        where: { admin: true, employee: { name } },
        relations: ["employee"],
      });
      res.status(HttpStatusCode.Ok).json(adminsConsumers);
    } catch (error) {
      logger.info(error.detail);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      await consumerRepository.delete({});
      res.status(HttpStatusCode.Ok).json(Message.okResponse);
    } catch (error) {
      logger.error(error.detail);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async getAllEmployerConsumers(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { skip, lastName, status, sortByCountrycode, sortByLastName } =
        req.query;

      const byLastName = function (): any {
        if (sortByLastName === "true") return "ASC";
      };

      const byCode = function (): any {
        if (sortByCountrycode === "true") return "ASC";
      };

      const searchByStatus = function (): any {
        const currentStatus = status.toString().toLocaleLowerCase();
        if (currentStatus === "admin") {
          return true;
        } else if (currentStatus === "consumer") {
          return false;
        } else {
          return;
        }
      };

      const adminsConsumers = await consumerRepository.find({
        relations: ["employee"],
        where: {
          employee: { id },
          lastName: Like(`%${lastName}%`),
          admin: searchByStatus(),
        },

        order: {
          lastName: byLastName(),
          countryCode: byCode(),
        },
        skip: (+skip - 1) * 10,
        take: 10,
      });

      res.status(HttpStatusCode.Ok).json(adminsConsumers);
    } catch (error) {
      logger.info(error.detail);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async getAllEmployerConsumersAmount(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const adminsConsumers = await consumerRepository.find({
        where: {
          employee: { id },
        },
        relations: ["employee"],
      });
      res.status(HttpStatusCode.Ok).json(adminsConsumers.length);
    } catch (error) {
      logger.info(error.detail);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async updateConsumer(req: Request, res: Response) {
    try {
      const consumer = req.body;
      const currentConsumer = await consumerRepository.findOne({
        where: { id: consumer.id },
      });
      consumerRepository.merge(currentConsumer, { ...consumer });
      await consumerRepository.save(currentConsumer);
      res.status(HttpStatusCode.Ok).json(Message.updateData);
    } catch (error) {
      logger.error(error.detail);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }
}

export const consumerController = new ConsumerController();
