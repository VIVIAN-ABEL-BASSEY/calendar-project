import app from "./app";
import { connectDB } from "./config/db";
import { startReminderCron } from "./utils/reminderCron";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  startReminderCron()
};

startServer();