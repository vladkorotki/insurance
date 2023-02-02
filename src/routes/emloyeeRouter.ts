import * as express from "express";
import { employeeController } from "../controllers/employeeController";
import { checkAccessJwt } from "../middleware/checkJwt";


const router = express.Router();

router.get("/user/employee", employeeController.getAll);
router.get("/user/amount", employeeController.getEmployersAmount);

router.get("/user/employers/profile/:id", employeeController.getEmployer);

router.delete("/employee/deleteAll", employeeController.deleteAll);
router.delete("/employee/deleteUser", employeeController.deleteUser);
router.put("/user/employers/profile", checkAccessJwt, employeeController.updateEmployerData);

export default router;
