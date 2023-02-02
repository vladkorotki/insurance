import * as express from "express";
import { userController } from "../controllers/userController";
import { checkAccessJwt } from "../middleware/checkJwt";

const router = express.Router();
//technical endpoints
router.get("/user/all", userController.getAllUsers);
router.delete("/user/deleteAllUsers", userController.deleteAllUsers);

router.post("/user/add", userController.createUser);

router.delete("/user/delete",checkAccessJwt, userController.deleteUser);

router.get("/user/employers", userController.getEmployers);

export default router;
