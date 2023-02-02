import { Request, Response } from "express";
import { Role } from "../entity/Role";
import { roleRepository } from "../repositiries/repositories";
import { Message } from "../shared/enums/enums-message";
import logger from "../../logger";
import { HttpStatusCode } from "../shared/enums/enum-httpStatusCode";

class RoleController {
  async createNewRole(req: Request, res: Response) {
    try {
      const { roleName } = req.body;

      const existedRole = await roleRepository.findBy({ roleName });

      if (!existedRole.length) {
        const newRole = new Role(roleName);
        await roleRepository.save(newRole);
        res.status(HttpStatusCode.Ok).json(Message.createdRole);
      } else {
        res
          .status(HttpStatusCode.InternalServerError)
          .json(Message.existedRole);
      }
    } catch (error) {
      logger.error(error);
      if (!error.QueryFailedError) {
        return res
          .status(HttpStatusCode.InternalServerError)
          .json(`${Message.badRole}`);
      }
      res
        .status(HttpStatusCode.InternalServerError)
        .json(`${(Message.errorResponse, error)} `);
    }
  }

  async getAllRoles(req: Request, res: Response) {
    try {
      const roles = await roleRepository.find({ relations: { user: true } });
      res.status(HttpStatusCode.Ok).json(roles);
    } catch (error) {
      logger.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json(Message.errorResponse);
    }
  }

  async deleteRole(req: Request, res: Response) {
    try {
      const { roleName } = req.body;
      const deletedUser = await roleRepository.delete({ roleName });

      res
        .status(HttpStatusCode.Ok)
        .json({ message: `Count of deleted users: ${deletedUser.affected}` });
    } catch (error) {
      logger.error(error);

      if (!error.QueryFailedError) {
        return res
          .status(HttpStatusCode.InternalServerError)
          .json(`${Message.notFoundRole}`);
      }
      res
        .status(HttpStatusCode.InternalServerError)
        .json(`${Message.errorResponse}`);
    }
  }
}

export const roleController = new RoleController();
