import { sendTaskReminderEmail } from '../../utils/emailService'
import { Task } from '../task/task.model'
import { User } from '../user/user.model'

export const sendTaskReminder = async (
  taskId: string,
  userId: string
): Promise<void> => {
  const task = await Task.findOne({ _id: taskId, userId })
  if (!task) throw new Error('Task not found')
  if (!task.dueDate) throw new Error('Task has no due date')

  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')

  await sendTaskReminderEmail({
    toEmail:   user.email,
    firstName: user.firstName,
    taskTitle: task.title,
    dueDate:   task.dueDate.toISOString(),
  })
}