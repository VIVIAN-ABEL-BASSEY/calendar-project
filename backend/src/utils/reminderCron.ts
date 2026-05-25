// src/utils/reminderCron.ts
import cron from 'node-cron'
import { Task } from '../modules/task/task.model'
import { User } from '../modules/user/user.model'
import { sendTaskReminderEmail } from './emailService'

export const startReminderCron = () => {
  // runs every hour at minute 0
  // e.g. 8:00, 9:00, 10:00...
  cron.schedule('0 * * * *', async () => {
    console.log('Running reminder cron job...')

    try {
      const now = new Date()

      // find tasks due in the next 24 hours that are not completed
      const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

      const tasksDueSoon = await Task.find({
        dueDate: {
          $gte: now,
          $lte: in24Hours,
        },
        status: { $ne: 'completed' },
      })

      console.log(`Found ${tasksDueSoon.length} tasks due in next 24 hours`)

      for (const task of tasksDueSoon) {
        try {
          const user = await User.findById(task.userId)
          if (!user) continue

          await sendTaskReminderEmail({
            toEmail:   user.email,
            firstName: user.firstName,
            taskTitle: task.title,
            dueDate:   task.dueDate!.toISOString(),
          })

          console.log(`Reminder sent for task: ${task.title} to ${user.email}`)
        } catch (err) {
          console.error(`Failed to send reminder for task ${task._id}:`, err)
        }
      }
    } catch (err) {
      console.error('Cron job error:', err)
    }
  })

  console.log('Reminder cron job started')
}