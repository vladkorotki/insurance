import { Request, Response } from "express";
import { plansRepository, userRepository } from "../repositiries/repositories";
import { HttpStatusCode } from "../shared/enums/enum-httpStatusCode";
import { Message } from "../shared/enums/enums-message";
import logger from "../../logger";
import { Plans } from "../entity/Plans";
import relationObject from "../shared/relations/relations";
import { resolve } from "path";
import { UserPlanType } from "../shared/enums/enum-userPlanType";
import { Like } from "typeorm";

class PlansController {
  async createPlan(req: Request, res: Response) {
    try {
      const { id, planData, planId, friquence, startDate, endDate } = req.body;
      let foundUserEmployer = null;
      let foundUserAdmin = null;

      if (planData) {
        foundUserAdmin = await userRepository.findOne({
          relations: relationObject,
          where: {
            role: {
              roleName: "admin",
            },
            id
          },
        });
      } else {
        foundUserEmployer = await userRepository.findOne({
          relations: relationObject,
          where: {
            role: {
              roleName: "employer",
            },
            employee: {
              id: id,
            },
          },
        });
      }

      if (foundUserAdmin) {
        const plan = new Plans(planData);
        plan.userType = UserPlanType.userAdminType;
        await plansRepository.save(plan);
        userRepository.merge(foundUserAdmin, {
          plans: [...foundUserAdmin.plans, plan],
        });
        await userRepository.save(foundUserAdmin);
      }
      if (foundUserEmployer) {
        const foundPlan = await plansRepository.findOne({
          where: { id: planId },
        });

        const plan = new Plans({
          startDate,
          endDate,
          friquence,
          name: foundPlan.name,
          type: foundPlan.type,
          contributions: foundPlan.contributions,
        });
        plan.userType = UserPlanType.userEmployerType;
        await plansRepository.save(plan);
        userRepository.merge(foundUserEmployer, {
          plans: [...foundUserEmployer.plans, plan],
        });
        await userRepository.save(foundUserEmployer);
      }
      res.status(HttpStatusCode.Ok).json(Message.okPlan);
    } catch (error) {
      logger.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  //delete plans only for technical using
  async deletePlans(req: Request, res: Response) {
    try {
      await plansRepository.delete({});
      res.json("delete");
    } catch (error) {
      logger.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async deleteAdminPlan(req: Request, res: Response) {
    try {
      const { id, name } = req.body;
      const foundAdmin = await userRepository.findOne({
        where: {
          role: {
            roleName: "admin",
          },
          id
        },
        relations: relationObject,
      });

      const deletedPlans = await plansRepository.delete({ name });
      res
        .status(HttpStatusCode.Ok)
        .json({ message: `Count of deleted users: ${deletedPlans.affected}` });
    } catch (error) {
      logger.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async deleteEmployerPlan(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const deletedPlan = await plansRepository.delete({ id });

      res
        .status(HttpStatusCode.Ok)
        .json({ message: `Count of deleted users: ${deletedPlan.affected}` });
    } catch (error) {
      logger.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  //getPlans only for technical using
  async getPlans(req: Request, res: Response) {
    try {
      const plans = await plansRepository.find({
        // relations: ["user"],
      });
      res.json(plans);
    } catch (error) {
      logger.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async getAdminPlansListForSelect(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const plans = await plansRepository.find({
        where: {
          userType: UserPlanType.userAdminType,
        },
      });
      res.status(HttpStatusCode.Ok).json(plans);
    } catch (error) {
      logger.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async getUserPlans(req: Request, res: Response) {
    let plans = null;
    try {
      let {
        skip,
        planName,
        planType,
        sortByName,
        sortByType,
        sortByDate,
        startDate,
      } = req.query;

      const byName = function (): any {
        if (sortByName === "true") return "ASC";
      };

      const byType = function (): any {
        if (sortByType === "true") return "ASC";
      };

      const byDate = function (): any {
        if (sortByDate === "true") return "ASC";
      };

      const { id } = req.params;
      const foundUserAdmin = await userRepository.findOne({
        relations: relationObject,
        where: {
          role: {
            roleName: "admin",
          },
          id
        },
      });

      const foundUserEmployer = await userRepository.findOne({
        relations: relationObject,
        where: {
          employee: {
            id: id,
          },
        },
      });

      if (foundUserAdmin) {
        plans = await plansRepository.find({
          where: {
            userType: UserPlanType.userAdminType,
            name: Like(`%${planName}%`),
            type: Like(`%${planType}%`),
          },
          skip: (+skip - 1) * 10,
          take: 10,

          order: {
            name: byName(),
            type: byType(),
          },
        });
      }

      if (foundUserEmployer) {
        let date = startDate ? new Date(startDate.toString()) : undefined;
        plans = await plansRepository.find({
          where: {
            user: {
              employee: {
                id: id,
              },
            },
            startDate: date,
            name: Like(`%${planName}%`),
          },
          skip: (+skip - 1) * 10,
          take: 10,
          order: {
            name: byName(),
            startDate: byDate(),
          },
        });
      }

      res.status(HttpStatusCode.Ok).json(plans);
    } catch (error) {
      logger.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async updateAdminPlan(req: Request, res: Response) {
    try {
      const { id, planData } = req.body;

      const foundAdmin = await userRepository.findOne({
        where: {
          // admin: {
          //   id: id,
          // },
          id
        },
        relations: relationObject,
      });
      if (!foundAdmin) {
        return res.status(HttpStatusCode.BadRequest).json(Message.userNotFound);
      }
      const updatedPlan = await plansRepository.findOne({
        relations: { user: true },
        where: { id: planData.id },
      });
      const oldPlanName = updatedPlan.name;

      plansRepository.merge(updatedPlan, { ...planData });
      await plansRepository.save(updatedPlan);

      res.status(HttpStatusCode.Ok).json(Message.updatePlan);
      return await plansRepository.update(
        {
          name: oldPlanName,
        },
        {
          name: planData.name,
          type: planData.type,
          contributions: planData.contributions,
        }
      );
    } catch (error) {
      logger.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async updateEmployerPlan(req: Request, res: Response) {
    try {
      const { plan } = req.body;

      const foundAdmin = await plansRepository.findOne({
        where: {
          id: plan.id,
        },
        relations: ["user"],
      });

      plansRepository.merge(foundAdmin, { ...plan });
      await plansRepository.save(foundAdmin);

      res.status(HttpStatusCode.Ok).json(Message.updatePlan);
    } catch (error) {
      logger.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async getPlansAmount(req: Request, res: Response) {
    const { userType, id }: any = req.params;
    let plans = null;
    try {
      if (!id) {
        plans = await plansRepository.find({
          where: {
            userType: userType,
          },
        });
      } else {
        plans = await plansRepository.find({
          where: {
            userType: userType,
            user: {
              employee: { id },
            },
          },
        });
      }

      const amountPlans = plans.length;
      res.status(HttpStatusCode.Ok).json(amountPlans);
    } catch (error) {
      logger.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }
}

export const plansController = new PlansController();
