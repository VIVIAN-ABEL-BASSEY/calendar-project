import express from "express";
import { createTask, getUserTasks, getTaskById, updateTask, deleteTask} from "./task.controller";
import { authenticate } from "../../middleware/auth.middleware";


const router = express.Router();

router.post("/", authenticate , createTask);
router.get("/", authenticate, getUserTasks);
router.get("/:id", authenticate, getTaskById);
router.patch("/:id", authenticate, updateTask)
router.delete("/:id", authenticate, deleteTask);

export default router;