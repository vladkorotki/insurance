import * as express from "express";
import { authController } from "../controllers/authController";
import { checkAccessJwt } from "../middleware/checkJwt";

const router = express.Router();

router.post("/login", authController.login);
router.get("/refresh", authController.refresh);

router.post("/logout", authController.logout); // this route dont user 10/01/2023

export default router;
