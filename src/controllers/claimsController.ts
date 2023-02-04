import { Request, Response } from "express";
import {
  claimsRepository,
  consumerRepository,
  plansRepository,
  userRepository,
} from "../repositiries/repositories";
import { HttpStatusCode } from "../shared/enums/enum-httpStatusCode";
import { Message } from "../shared/enums/enums-message";

import logger from "../../logger";
import { Claims } from "../entity/Claims";
import { DataReq, IClaims } from "../shared/types/types";
import { Equal, Like } from "typeorm";
class ClaimsController {
  async createClaim(req: Request, res: Response) {
    try {
      const { data } = req.body;
      const foundConsumer = await consumerRepository.findOne({
        where: {
          id: data.consumerId,
        },
        relations: ["employee", "claims"],
      });

      const foundPlan = await userRepository.findOne({
        where: {
          employee: {
            consumer: {
              id: data.consumerId,
            },
          },
          plans: {
            name: data.plan,
          },
        },
      });

      if (!foundConsumer) {
        return res
          .status(HttpStatusCode.InternalServerError)
          .json(Message.consumerNotFound);
      }

      if (!foundPlan) {
        return res
          .status(HttpStatusCode.InternalServerError)
          .json(Message.notFoundPlan);
      }

    
      const claim = new Claims(data);
      claim.employer = foundConsumer.employee.name;
      await claimsRepository.save(claim);
      consumerRepository.merge(foundConsumer, {
        claims: [...foundConsumer.claims, claim],
      });

      await consumerRepository.save(foundConsumer);
      res.status(HttpStatusCode.Ok).json(Message.successClaimCreate);
    } catch (error) {
      logger.error(error.detail);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async getAllclaims(req: Request, res: Response) {
    try {
      let {
        skip,
        employerName,
        claimNumber,
        claimStatus,
        sortByEmployer,
        sortByDate,
      } = req.query;

      claimNumber = claimNumber.toString();
      let number: number = Number(claimNumber);

      const byEmployerName = function (): any {
        if (sortByEmployer === "true") return "ASC";
      };

      const byDate = function (): any {
        if (sortByDate === "true") return "ASC";
      };

      const data = await claimsRepository.find({
        relations: ["consumer"],
        where: {
          employer: Like(`%${employerName}%`),
          claimNumber: number || null,
          status: Like(`%${claimStatus.toString().toLocaleLowerCase()}%`),
        },
        skip: (+skip - 1) * 10,
        take: 10,
        order: {
          employer: byEmployerName(),
          date: byDate(),
        },
      });

      res.status(HttpStatusCode.Ok).json(data);
    } catch (error) {
      logger.error(error.detail);

      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async getClaimsAmount(req: Request, res: Response) {
    try {
      const data = await claimsRepository.find({});

      res.status(HttpStatusCode.Ok).json(data.length);
    } catch (error) {
      logger.error(error.detail);

      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      await claimsRepository.delete({});
      res.status(HttpStatusCode.Ok).json(Message.okResponse);
    } catch (error) {
      logger.error(error.detail);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async updateClaim(req: Request, res: Response) {
    try {
      const { claim } = req.body;
      const currentClaim = await claimsRepository.findOne({
        where: { id: claim.id },
      });

      claimsRepository.merge(currentClaim, { ...claim });
      await claimsRepository.save(currentClaim);

      return res.status(HttpStatusCode.Ok).json(Message.updateData);
    } catch (error) {
      logger.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }
}

export const claimsController = new ClaimsController();
