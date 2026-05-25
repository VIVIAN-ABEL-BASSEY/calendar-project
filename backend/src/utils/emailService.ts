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
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#f6f8fc;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f8fc;padding:32px 0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:8px;padding:32px;">
            <tr>
              <td>
                <h2 style="color:#4285f4;margin:0 0 16px 0;font-size:22px;">Task Myr</h2>
                <p style="color:#202124;font-size:16px;margin:0 0 8px 0;">Hi ${firstName},</p>
                <p style="color:#202124;font-size:16px;margin:0 0 24px 0;">This is a reminder that your task is due soon.</p>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f8fc;border-left:4px solid #4285f4;border-radius:4px;margin:0 0 24px 0;">
                  <tr>
                    <td style="padding:16px;">
                      <p style="margin:0;font-weight:bold;color:#202124;font-size:15px;">${taskTitle}</p>
                      <p style="margin:4px 0 0;color:#5f6368;font-size:14px;">Due: ${formattedDate}</p>
                    </td>
                  </tr>
                </table>
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="background:#4285f4;border-radius:4px;">
                      <a href="${process.env.FRONTEND_URL}" style="display:inline-block;padding:10px 24px;color:#ffffff;font-size:14px;text-decoration:none;font-weight:bold;">Open Task Myr</a>
                    </td>
                  </tr>
                </table>
                <p style="color:#9aa0a6;font-size:12px;margin:32px 0 0;">You received this because you have a task due on ${formattedDate}.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`, 
  })

  if (error) throw new Error(error.message)
}