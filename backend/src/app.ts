import express from "express"
import authRoutes from "./modules/auth/auth.routes"
import taskRoutes from "./modules/task/task.routes"
import taskGroupRoutes from "./modules/taskGroup/taskGroup.routes"
import notificationsRoutes from "./modules/notifications/notifications.routes"
import cors from "cors"
import passport from "./config/passport"

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}))
app.use(express.json())
app.use(passport.initialize())

app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/task-groups", taskGroupRoutes)
app.use("/api/notifications", notificationsRoutes)

export default app