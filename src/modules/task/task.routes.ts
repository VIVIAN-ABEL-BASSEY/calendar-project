import express from "express";
import { createTask, getUserTasks, updateTask, deleteTask} from "./task.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/", authenticate , createTask);
router.get("/", authenticate, getUserTasks);
router.patch("/:id", authenticate, updateTask)
router.delete("/:id", authenticate, deleteTask);

export default router;