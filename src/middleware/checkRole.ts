import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../shared/enums/enum-httpStatusCode";
import { Message } from "../shared/enums/enums-message";

export const checkRole = (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.body;

  if (role != "admin") {
    return res
      .status(HttpStatusCode.BadRequest)
      .json({ message: Message.notAddPlan });
  }
  next();
};
