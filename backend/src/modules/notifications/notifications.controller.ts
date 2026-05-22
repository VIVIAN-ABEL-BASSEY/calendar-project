import { Request, Response } from 'express'
import { sendTaskReminder } from './notifications.service'

export const remindTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId } = req.body
    const userId = (req as any).userId

    if (!taskId) {
      res.status(400).json({ message: 'taskId is required' })
      return
    }

    await sendTaskReminder(taskId, userId)

    res.json({ message: 'Reminder sent successfully' })
  } catch (err: any) {
    console.error('Notification error:', err)
    const status = err.message === 'Task not found' ? 404 : 500
    res.status(status).json({ message: err.message ?? 'Failed to send reminder' })
  }
}