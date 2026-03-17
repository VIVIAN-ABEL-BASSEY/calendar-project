import express from "express";
import { createTaskGroup , getUserTaskGroups, updateTaskGroup, deleteTaskGroup} from "./taskGroup.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/", authenticate, createTaskGroup);
router.get("/", authenticate, getUserTaskGroups);
router.patch("/:id", authenticate, updateTaskGroup);
router.delete("/:id", authenticate, deleteTaskGroup);

export default router;