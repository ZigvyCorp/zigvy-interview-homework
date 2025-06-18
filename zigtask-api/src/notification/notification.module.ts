import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import { MailModule } from '../mail/mail.module';
import { Task, TaskSchema } from '../tasks/tasks.schema';
import { User, UserSchema } from '../user/user.schema';

@Module({
  imports: [
    MailModule,
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [NotificationService],
})
export class NotificationModule {}
