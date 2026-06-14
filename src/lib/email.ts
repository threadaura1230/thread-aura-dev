import nodemailer from "nodemailer";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
  const host = process.env.MAIL_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.MAIL_PORT || "587");
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASSWORD;
  const fromName = process.env.MAIL_FROM || "enteropia";

  if (!user || !pass) {
    console.warn("Mail credentials not found in environment variables. Email sending skipped.");
    return { success: false, error: "SMTP credentials not configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"${fromName}" <${user}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully: ", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Failed to send email: ", error);
    return { success: false, error: error?.message || error };
  }
}
