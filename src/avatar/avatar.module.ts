import { Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { AvatarConfigService } from './avatar.config';
import { MongooseModule } from '@nestjs/mongoose';
import { Avatar, AvatarSchema } from './avatar.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Avatar.name, schema: AvatarSchema }]),
    ConfigModule,
  ],
  providers: [AvatarService, AvatarConfigService],
  exports: [AvatarService, AvatarConfigService],
})
export class AvatarModule {}
