import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from 'src/user/dto';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private rabbitClient: ClientProxy,
  ) {}
  private readonly logger = new Logger(NotificationService.name);

  sendToEmailService(createUserDto: CreateUserDto) {
    this.rabbitClient.emit('created-user', createUserDto);
    this.logger.debug('Message Emmited to rabbitMQ');
    return { status: 'success', user: createUserDto };
  }
}
