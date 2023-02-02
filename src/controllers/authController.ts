import { Request, Response } from "express-serve-static-core";
import { responseUserObject } from "../helpers/responseUser";
import { userRepository } from "../repositiries/repositories";
import { Message } from "../shared/enums/enums-message";
import jwt from "jsonwebtoken";

import logger from "../../logger";
import relationObject from "../shared/relations/relations";
import { HttpStatusCode } from "../shared/enums/enum-httpStatusCode";
import { tokenService } from "../servises/tokenService";
const deletedProps = [
  //   "accessToken",
  //   "refreshToken",
  "hashPassword",
  "password",
];

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { login, password } = req.body;
      const user = await userRepository.findOne({
        relations: relationObject,
        where: { login },
      });

      if (!user) {
        return res
          .status(HttpStatusCode.BadRequest)
          .json({ error: Message.userNotFound });
      } else if (user && !user.checkIfUnencryptedPasswordIsValid(password)) {
        return res
          .status(HttpStatusCode.BadRequest)
          .json({ error: Message.wrongPassword });
      }

      tokenService.createTokens(user);
      await userRepository.save(user);
      const result = responseUserObject(user, [...deletedProps]);

      res.status(HttpStatusCode.Ok).json(result);
    } catch (error) {
      logger.error(error.detail);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ error: `${error.detail}` });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const token = req.headers.authorization;
      
      await tokenService.checkRefreshToken(token);
      const foundUser = await userRepository.findOne({
        relations:relationObject,
        where: { refreshToken: token },
       
      });
  
      
      tokenService.createTokens(foundUser);
      await userRepository.save(foundUser);
      return res.status(HttpStatusCode.Ok).json({accessToken: foundUser.accessToken, refreshToken:foundUser.refreshToken, id: foundUser.id});

  
    } catch (error) {
      logger.error(error.detail);
      res
        .status(HttpStatusCode.Unauthorized)
        .json({error:Message.Unauthorized}  ); // не нашел рефреш токена в БЗ - переавторизация
    }
  }

  //this method dont use 10/01/2023
  async logout(req: Request, res: Response) {
    try {
     
      const { accessToken, refreshToken, userId } = req.body;

      const foundUser = await userRepository.findOne({
        where: {
          accessToken: accessToken,
          refreshToken: refreshToken,
          id: userId,
        },
        relations: relationObject,
      });

      userRepository.merge(foundUser, {
        accessToken: "",
        refreshToken: "",
      });
      await userRepository.save(foundUser);
      const result = responseUserObject(foundUser, [...deletedProps]);
      res.status(HttpStatusCode.Ok).json('logout');
    } catch (error) {
      logger.error(error.detail);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ error: ` ${error.detail}` });
    }
  }
}

export const authController = new AuthController();
