import client from './axiosClient'

export const sendReminder = (taskId: string) =>
  client.post('/notifications/remind', { taskId }).then(r => r.data)