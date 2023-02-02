import * as express from "express";
import { plansController } from "../controllers/plansController";
import { checkRole } from "../middleware/checkRole";
const router = express.Router();
//technical endpoints
router.get("/user/plans", plansController.getPlans);
router.delete("/user/plans/alldelete", plansController.deletePlans);

router.post("/user/plans/add",  plansController.createPlan);
router.post("/user/plans/addEmployerPlan", plansController.createPlan);

router.delete("/user/plans/delete",  plansController.deleteAdminPlan);
router.delete("/user/plans/deleteEmployerPlan", plansController.deleteEmployerPlan);

router.put("/user/plans/update",  plansController.updateAdminPlan);
router.put("/employer/plans/update", plansController.updateEmployerPlan);

router.get("/user/plans/:id", plansController.getUserPlans);
router.get("/user/plans/admin/:id", plansController.getAdminPlansListForSelect);
router.get("/user/plans/:user/:id", plansController.getUserPlans);


router.get("/user/plans-amount/:userType", plansController.getPlansAmount)

router.get("/user/plans-amount/:userType/:id", plansController.getPlansAmount)


export default router;
