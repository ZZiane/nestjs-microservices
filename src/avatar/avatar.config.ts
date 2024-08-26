import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AvatarConfigService {
  constructor(private configService: ConfigService) {}

  getAvatarUrl(): string {
    return this.configService.get<string>('USER_SERVICE_URL');
  }
}
