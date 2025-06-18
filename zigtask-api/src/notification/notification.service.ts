import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Task, TaskDocument } from '../tasks/tasks.schema';
import { User, UserDocument } from '../user/user.schema';
import { MailService } from '../mail/mail.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendScheduledReminder() {
    this.logger.log('Checking for tasks due within the next hour...');

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const tasksDueSoon = await this.taskModel.find({
      dueDate: { $gte: now, $lte: oneHourLater },
    });

    if (!tasksDueSoon.length) {
      this.logger.log('No tasks due soon.');
      return;
    }

    const ownerIds = Array.from(
      new Set(tasksDueSoon.map((task) => task.ownerId.toString())),
    );

    const users = await this.userModel.find({
      _id: { $in: ownerIds },
    });

    const userMap = new Map(
      users.map((user) => [user._id.toString(), user.email]),
    );

    const groupedByEmail: Record<string, TaskDocument[]> = {};

    for (const task of tasksDueSoon) {
      const email = userMap.get(task.ownerId.toString());
      if (!email) continue;

      if (!groupedByEmail[email]) {
        groupedByEmail[email] = [];
      }
      groupedByEmail[email].push(task);
    }

    for (const [email, tasks] of Object.entries(groupedByEmail)) {
      const message = tasks
        .map(
          (task) => `- ${task.title}: due at ${task.dueDate.toLocaleString()}`,
        )
        .join('\n');

      await this.mailService.sendMail(
        email,
        'You have tasks due within the next hour',
        message,
      );

      this.logger.log(`Email sent to ${email}`);
    }
  }
}
