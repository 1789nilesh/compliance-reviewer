import * as express from "express";
import { controller } from "../controller/HealthController";

const router = express.Router();

router.get("/health", controller.Health);

export const health = router;
