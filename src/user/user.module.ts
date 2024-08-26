import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './user.schema';
import { NotificationModule } from 'src/notification/notification.module';
import { AvatarService } from 'src/avatar/avatar.service';
import { Avatar, AvatarSchema } from 'src/avatar/avatar.schema';
import { ConfigModule } from '@nestjs/config';
import { AvatarConfigService } from 'src/avatar/avatar.config';
import { AvatarModule } from 'src/avatar/avatar.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Avatar.name, schema: AvatarSchema }]),
    ConfigModule,
    NotificationModule,
    AvatarModule,
  ],
  controllers: [UserController],
  providers: [UserService, AvatarService, AvatarConfigService],
})
export class UserModule {}
