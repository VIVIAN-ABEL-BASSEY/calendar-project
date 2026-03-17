import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import taskRoutes from "./modules/task/task.routes";
import taskGroupRoutes from "./modules/taskGroup/taskGroup.routes";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes);
app.use("/api/task-groups", taskGroupRoutes);

export default app;

