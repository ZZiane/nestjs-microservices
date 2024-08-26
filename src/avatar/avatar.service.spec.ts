// avatar.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AvatarService } from './avatar.service';
import { getModelToken } from '@nestjs/mongoose';
import { Avatar, AvatarDocument } from './avatar.schema';
import { Model } from 'mongoose';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { NotFoundException } from '@nestjs/common';
import { AvatarConfigService } from './avatar.config';
import { ConfigModule } from '@nestjs/config';

jest.mock('axios');
jest.mock('./avatar.config');
jest.mock('./avatar.service');

describe('AvatarService', () => {
  let service: AvatarService;
  let model: Model<AvatarDocument>;
  let avatarConfigService: AvatarConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
      ],
      providers: [
        AvatarService,
        AvatarConfigService,
        {
          provide: getModelToken(Avatar.name),
          useValue: {
            findOne: jest.fn(),
            findOneAndDelete: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AvatarService>(AvatarService);
    model = module.get<Model<AvatarDocument>>(getModelToken(Avatar.name));
    avatarConfigService = module.get<AvatarConfigService>(AvatarConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAvatar', () => {
    it('should retrieve avatar', async () => {
      const userId = '1';
      const result = await service.getAvatar(userId);
      expect(result).not.toBeNull();
    });

    it('should fetch and save avatar if not in database', async () => {
      const userId = '3';
      const avatarUrl = 'https://reqres.in/img/faces/3-image.jpg';
      const imageData = Buffer.from('binaryimagedata');
      const base64Image = imageData.toString('base64');
      const hash = crypto.createHash('md5').update(imageData).digest('hex');
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        'resources',
        'avatars',
        `${userId}-${hash}.png`,
      );

      const axiosGetMock = jest
        .spyOn(axios, 'get')
        .mockResolvedValueOnce({ data: { avatar: avatarUrl } });
      const axiosImageGetMock = jest
        .spyOn(axios, 'get')
        .mockResolvedValueOnce({ data: imageData });
      const fsWriteFileSyncMock = jest
        .spyOn(fs, 'writeFileSync')
        .mockImplementation();

      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(model as any, 'save').mockResolvedValueOnce({
        userId,
        hash,
        data: base64Image,
      } as AvatarDocument);

      const result = await service.getAvatar(userId);
      console.log(result);
      expect(result).toBe(base64Image);
      expect(axiosGetMock).toHaveBeenCalledWith(
        `${avatarConfigService.getAvatarUrl()}/api/users/${userId}`,
      );
      expect(axiosImageGetMock).toHaveBeenCalledWith(avatarUrl, {
        responseType: 'arraybuffer',
      });
      expect(fsWriteFileSyncMock).toHaveBeenCalledWith(filePath, imageData);
      expect(model.prototype.save).toHaveBeenCalledWith();
    });

    it('should throw NotFoundException if user avatar not found', async () => {
      const userId = '1';
      jest
        .spyOn(axios, 'get')
        .mockResolvedValueOnce({ data: { data: { avatar: null } } });

      await expect(service.getAvatar(userId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('deleteAvatar', () => {
    it('should delete avatar from database and file system', async () => {
      const userId = '1';
      const avatarData = 'base64image...';
      const avatarDocument = {
        userId,
        data: avatarData,
        hash: 'test',
      } as AvatarDocument;
      jest
        .spyOn(model, 'findOneAndDelete')
        .mockResolvedValueOnce(avatarDocument);
      const fsExistsSyncMock = jest
        .spyOn(fs, 'existsSync')
        .mockReturnValueOnce(true);
      const fsUnlinkSyncMock = jest
        .spyOn(fs, 'unlinkSync')
        .mockImplementation();

      await service.deleteAvatar(userId);

      expect(model.findOneAndDelete).toHaveBeenCalledWith({ userId });
      expect(fsExistsSyncMock).toHaveBeenCalledWith(
        expect.stringContaining('test.png'),
      );
      expect(fsUnlinkSyncMock).toHaveBeenCalledWith(
        expect.stringContaining('test.png'),
      );
    });

    it('should do nothing if avatar not found in database', async () => {
      const userId = '666';
      jest.spyOn(model, 'findOneAndDelete').mockResolvedValueOnce(null);

      await service.deleteAvatar(userId);

      expect(model.findOneAndDelete).toHaveBeenCalledWith({ userId });
    });
  });
});
