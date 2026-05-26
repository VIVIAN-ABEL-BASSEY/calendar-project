import cron from 'node-cron'
import { Task } from '../modules/task/task.model'
import { User } from '../modules/user/user.model'
import { sendTaskReminderEmail } from './emailService'

export const startReminderCron = () => {
  cron.schedule('* * * * *', async () => {
    console.log('Running reminder cron job...')

    try {
      const now = new Date()
      const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

      // only fetch tasks that haven't had a reminder sent yet
      const tasksDueSoon = await Task.find({
        dueDate: {
          $gte: now,
          $lte: in24Hours,
        },
        status: { $ne: 'completed' },
        reminderSentAt: null,  // only unsent reminders
      })

      console.log(`Found ${tasksDueSoon.length} tasks needing reminders`)

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

          // mark the task so we don't send again
          await Task.findByIdAndUpdate(task._id, {
            reminderSentAt: new Date()
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