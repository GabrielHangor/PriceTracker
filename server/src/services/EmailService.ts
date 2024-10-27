import nodemailer, { type Transporter } from "nodemailer";

interface MailOptions {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "yandex",
      auth: {
        user: "test",
        pass: "test"
      }
    });
  }

  async sendEmail(options: MailOptions): Promise<void> {
    const mailOptions = {
      from: "gabrielhabibulin@yandex.ru",
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}

export default new EmailService();
