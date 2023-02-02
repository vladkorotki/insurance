import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { tokenService } from "../servises/tokenService";
import { HttpStatusCode } from "../shared/enums/enum-httpStatusCode";
import { Message } from "../shared/enums/enums-message";


export const checkAccessJwt = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader: string = req.headers.authorization;
 
  if (!authHeader) {
    res.status(HttpStatusCode.Unauthorized).json({ error:Message.errorResponse });
  }
    const token: string = authHeader;
    try {
      await tokenService.checkAccessToken(token);
      next();
    } catch (error) {
      res.status(HttpStatusCode.Unauthorized).json({ error:Message.errorResponse });
    }
};
