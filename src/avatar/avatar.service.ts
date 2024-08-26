import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Avatar, AvatarDocument } from './avatar.schema';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { AvatarConfigService } from './avatar.config';

@Injectable()
export class AvatarService {
  constructor(
    @InjectModel(Avatar.name) private avatarModel: Model<AvatarDocument>,
    private readonly avatarConfigService: AvatarConfigService,
  ) {}

  private getFilePath(userId: string, hash: string): string {
    const directory = path.join(__dirname, '..', '..', 'resources', 'avatars');
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    return path.join(directory, `${userId}-${hash}.png`);
  }

  async getAvatar(userId: string): Promise<string> {
    const avatar = await this.avatarModel.findOne({ userId });

    if (avatar) {
      return avatar.data;
    } else {
      const user = await axios
        .get(`${this.avatarConfigService.getAvatarUrl()}/api/users/${userId}`)
        .then((res) => res.data.data);
      if (!user || !user.avatar) {
        throw new NotFoundException('User avatar not found');
      }
      const image = await axios
        .get(user.avatar, { responseType: 'arraybuffer' })
        .then((res) => res.data);
      const hash = crypto.createHash('md5').update(image).digest('hex');
      const base64Image = Buffer.from(image).toString('base64');
      const filePath = this.getFilePath(userId, hash);
      fs.writeFileSync(filePath, image);
      const avatarDocument = new this.avatarModel({
        userId,
        hash,
        data: base64Image,
      });
      await avatarDocument.save();

      return base64Image;
    }
  }

  async deleteAvatar(userId: string): Promise<boolean> {
    const avatar = await this.avatarModel.findOneAndDelete({ userId });
    if (avatar) {
      const filePath = this.getFilePath(userId, avatar.hash);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return true;
    }
    return false;
  }
}
