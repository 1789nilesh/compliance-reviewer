import * as express from "express";
import { complianceController } from "../controller/ComplianceController";

const router = express.Router();

router.get("/check", complianceController.checkCompliance);

export const compliance = router;