import { User } from "../entity/User";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositiries/repositories";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../shared/enums/enum-httpStatusCode";
import { access } from "fs";
class TokenService {
  createTokens(user: User) {
    const accessToken = jwt.sign(
      { username: user.login, role: user.role.roleName },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: "12h" }
    );
    const refreshToken = jwt.sign(
      { username: user.login, role: user.role.roleName },
      process.env.REFRESH_TOKEN_KEY,
      { expiresIn: "30d" }
    );
    userRepository.merge(user, {
      accessToken: "Bearer " + accessToken,
      refreshToken: refreshToken,
    });
  }

  async checkAccessToken(token: string) {
    const user = await userRepository.findOne({
      where: {
        accessToken: token,
      },
    });
    let accessToken = token.split(" ")[1];
    let veryfyToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
   

    if (!user || !veryfyToken) {
      return null;
    } else {
      return veryfyToken;
    }
  }

  async checkRefreshToken(token: string) {
    const user = await userRepository.findOne({
      where: {
        refreshToken: token,
      },
    });
	
    let veryfyToken = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
   

    if (!user || !veryfyToken) {
      return null;
    } else {
      return veryfyToken;
    }
  }
}

export const tokenService = new TokenService();
