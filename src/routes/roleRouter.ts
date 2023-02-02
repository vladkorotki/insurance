import * as express from "express";
import { roleController } from "../controllers/roleController";

const router = express.Router();

router.post("/role/add", roleController.createNewRole);
router.get("/role/all", roleController.getAllRoles);
router.delete("/role/delete", roleController.deleteRole);

export default router;
