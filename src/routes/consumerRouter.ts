
import * as express from "express";
import { consumerController } from "../controllers/consumerController";

const router = express.Router();

router.get("/employer/consumers", consumerController.getAllConsumers);
// router.get("/consumers/admins/:name", consumerController.getAllAdminsConsumers);
router.get("/employer/consumers/:id", consumerController.getAllEmployerConsumers);
router.get("/employer/consumers/amount/:id", consumerController.getAllEmployerConsumersAmount);
router.put("/employer/consumers/:name", consumerController.updateConsumer);
router.delete("/consumers/deleteAll", consumerController.deleteAll);


export default router;

