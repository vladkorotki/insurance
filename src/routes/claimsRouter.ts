
import * as express from "express";
import { claimsController } from "../controllers/claimsController";
const router = express.Router();

router.post("/employer/claims", claimsController.createClaim);
router.get("/claims", claimsController.getAllclaims);
router.get("/claims/amount", claimsController.getClaimsAmount);
// router.get("/employer/consumers/:name", consumerController.getAllEmployerConsumers);
router.put("/claims/update", claimsController.updateClaim);
router.delete("/claims/deleteAll", claimsController.deleteAll);


export default router;

