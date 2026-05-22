import { Resend } from 'resend'

interface ReminderEmailParams {
  toEmail: string
  firstName: string
  taskTitle: string
  dueDate: string
}

export const sendTaskReminderEmail = async ({
  toEmail,
  firstName,
  taskTitle,
  dueDate,
}: ReminderEmailParams): Promise<void> => {
  // initialize inside the function so dotenv has already run by this point
  const resend = new Resend(process.env.RESEND_API_KEY)

  const formattedDate = new Date(dueDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  })

  const { error } = await resend.emails.send({
    from:    process.env.FROM_EMAIL as string,
    to:      toEmail,
    subject: `Reminder: "${taskTitle}" is due soon`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #4285f4; margin-bottom: 8px;">Task Myr</h2>
        <p style="color: #202124; font-size: 16px;">Hi ${firstName},</p>
        <p style="color: #202124; font-size: 16px;">
          This is a reminder that your task is due soon.
        </p>
        <div style="background: #f6f8fc; border-left: 4px solid #4285f4; padding: 16px; border-radius: 4px; margin: 24px 0;">
          <p style="margin: 0; font-weight: 600; color: #202124;">${taskTitle}</p>
          <p style="margin: 4px 0 0; color: #5f6368; font-size: 14px;">Due: ${formattedDate}</p>
        </div>
        
        <table cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
        <tr>
            <td style="background: #4285f4; border-radius: 4px; padding: 10px 20px;">
            
                href="${process.env.FRONTEND_URL}"
                style="color: #ffffff; font-size: 14px; text-decoration: none; font-family: sans-serif; display: inline-block;"
            >
                Open Task Myr
            </a>
            </td>
        </tr>
        </table>
        <p style="color: #9aa0a6; font-size: 12px; margin-top: 32px;">
          You received this because you have a task due on ${formattedDate}.
        </p>
      </div>
    `,
  })

  if (error) throw new Error(error.message)
}