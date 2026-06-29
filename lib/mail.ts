/**
 * Khodz Academy - Secure Mail Notification Helper using Resend API.
 * Gracefully falls back to mock console logs if RESEND_API_KEY is not defined.
 */

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[MOCK EMAIL] To: ${to}\nSubject: ${subject}\nBody: ${html.replace(/<[^>]*>/g, ' ')}\n`);
    return { success: true, mock: true };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Khodz Academy <onboarding@resend.dev>',
        to,
        subject,
        html,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Resend email delivery failed:', data);
      return { success: false, error: data };
    }

    return { success: true, id: data.id };
  } catch (error) {
    console.error('Resend request error:', error);
    return { success: false, error };
  }
}

export async function sendReceiptEmail(
  toEmail: string,
  studentName: string,
  courseName: string,
  amountGhs: number,
  reference: string
) {
  const subject = `Payment Confirmed: GHS ${amountGhs.toFixed(2)} - ${courseName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333;">
      <h2 style="color: #45ec9d; border-bottom: 2px solid #eaeaea; padding-bottom: 10px;">KHODZ ACADEMY RECEIPT</h2>
      <p>Hello <strong>${studentName}</strong>,</p>
      <p>Your payment for <strong>${courseName}</strong> has been successfully processed and verified.</p>
      
      <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
        <tr style="background: #f9f9f9;">
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Course</th>
          <td style="padding: 10px; border: 1px solid #ddd;">${courseName}</td>
        </tr>
        <tr>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Amount Paid</th>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">GHS ${amountGhs.toFixed(2)}</td>
        </tr>
        <tr style="background: #f9f9f9;">
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Reference</th>
          <td style="padding: 10px; border: 1px solid #ddd; font-family: monospace;">${reference}</td>
        </tr>
        <tr>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Status</th>
          <td style="padding: 10px; border: 1px solid #ddd; color: green; font-weight: bold;">Success</td>
        </tr>
      </table>

      <p style="margin-top: 30px;">You can now log into your <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/student-dashboard" style="color: #45ec9d; font-weight: bold; text-decoration: none;">Student Dashboard</a> to check your curriculum and start learning.</p>
      <p>Regards,<br/><strong>Khodz Academy Support Team</strong></p>
    </div>
  `;

  return sendEmail({ to: toEmail, subject, html });
}

export async function sendPaymentDueEmail(
  toEmail: string,
  studentName: string,
  courseName: string,
  balanceGhs: number,
  deadlineString: string
) {
  const deadlineDate = new Date(deadlineString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subject = `Admission Secured: Remaining Balance Deadline - ${courseName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333;">
      <h2 style="color: #ea4335; border-bottom: 2px solid #eaeaea; padding-bottom: 10px;">PAYMENT DUE REMINDER</h2>
      <p>Hello <strong>${studentName}</strong>,</p>
      <p>Congratulations on securing your admission slot for <strong>${courseName}</strong>!</p>
      <p>Please note that since you opted for split payment, your remaining balance of <strong>GHS ${balanceGhs.toFixed(2)}</strong> must be settled before 3 weeks to the program start date.</p>
      
      <div style="background: #fff5f5; border-left: 4px solid #ea4335; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold; color: #ea4335;">Payment Deadline: ${deadlineDate}</p>
        <p style="margin: 5px 0 0 0; font-size: 13px;">To avoid losing access to future weeks or learning modules, please complete this payment on time.</p>
      </div>

      <p>You can pay your remaining balance at any time by visiting the secure payment portal:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/balance?course=${encodeURIComponent(courseName)}" 
           style="background: #45ec9d; color: black; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
           Pay Remaining Balance Now
        </a>
      </p>

      <p>Regards,<br/><strong>Khodz Academy Billing Team</strong></p>
    </div>
  `;

  return sendEmail({ to: toEmail, subject, html });
}

export async function sendWelcomeEmail(toEmail: string, studentName: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const logoUrl = `${siteUrl}/k3.png`;
  
  const subject = `Welcome to Khodz Academy, ${studentName}! 🎉`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333; line-height: 1.6;">
      <div style="text-align: center; background: #010d1a; padding: 20px; border-radius: 8px 8px 0 0;">
        <img src="${logoUrl}" alt="Khodz Academy" style="max-height: 50px; width: auto;" />
      </div>
      
      <div style="padding: 20px; border: 1px solid #eaeaea; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #36ECDF; margin-top: 0;">Welcome to the Ecosystem!</h2>
        <p>Hello <strong>${studentName}</strong>,</p>
        <p>We are thrilled to welcome you to <strong>Khodz Academy</strong> — the ultimate ecosystem for mastering high-performance technical engineering and software architecture.</p>
        
        <p>Your student account has been created successfully. Here are your next steps to get started:</p>
        
        <ol style="padding-left: 20px; margin: 20px 0;">
          <li style="margin-bottom: 10px;"><strong>Log in:</strong> Access your account using the email you signed up with.</li>
          <li style="margin-bottom: 10px;"><strong>Explore Courses:</strong> Browse our technical syllabus catalog and apply to a cohort.</li>
          <li style="margin-bottom: 10px;"><strong>Dashboard:</strong> Track your course progress, video materials, and slides live in the student portal.</li>
        </ol>

        <p style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/student-dashboard" 
             style="background: #36ECDF; color: #01203F; font-weight: bold; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 14px; letter-spacing: 0.5px;">
             Go to Student Dashboard
          </a>
        </p>

        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        
        <p style="font-size: 12px; color: #777;">If you have any questions or require support, reply directly to this email or reach out to our support team at any time.</p>
        <p style="margin-bottom: 0;">Regards,<br/><strong>Alex Khod & The Khodz Academy Team</strong></p>
      </div>
    </div>
  `;

  return sendEmail({ to: toEmail, subject, html });
}
