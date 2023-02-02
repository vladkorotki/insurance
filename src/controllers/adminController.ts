import { Request, Response } from "express";
import { userRepository } from "../repositiries/repositories";
import { HttpStatusCode } from "../shared/enums/enum-httpStatusCode";

class AdminController {
  async createAdmin(req: Request, res: Response) {
    try {
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ error: `${error.detail}` });
    }
  }
}

export const adminController = new AdminController();
