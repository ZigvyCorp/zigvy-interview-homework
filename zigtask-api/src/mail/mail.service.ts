/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: this.config.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const from = this.config.get<string>('EMAIL_FROM');
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      await this.transporter.sendMail({ from, to, subject, text });
      this.logger.log(`Email sent to ${to} - ${subject}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}`, err);
    }
  }
}
