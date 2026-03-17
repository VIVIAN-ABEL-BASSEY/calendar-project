import express from "express";
import { createTaskGroup , getUserTaskGroups} from "./taskGroup.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/", authenticate, createTaskGroup);
router.get("/", authenticate, getUserTaskGroups);

export default router;