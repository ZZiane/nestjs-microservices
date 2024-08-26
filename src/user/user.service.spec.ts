import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User, UserDocument } from './user.schema';
import { NotificationService } from '../notification/notification.service';
import { Model, Types } from 'mongoose';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UserService', () => {
  let service: UserService;
  let model: Model<UserDocument>;
  let notificationService: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: NotificationService,
          useValue: {
            sendToEmailService: jest.fn(),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: {
            new: jest.fn().mockResolvedValue({}),
            constructor: jest.fn().mockResolvedValue({}),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn().mockResolvedValue(true),
            create: jest.fn().mockResolvedValue({}),
            exec: jest.fn(),
            save: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
    notificationService = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const createdUser = {
      userId: new Types.ObjectId(),
      ...createUserDto,
    };

    jest
      .spyOn(model.prototype, 'save')
      .mockResolvedValueOnce(createdUser as any);

    const result = await service.create(createUserDto);
    expect(result).toEqual(createdUser);
    expect(notificationService.sendToEmailService).toHaveBeenCalledWith(
      createUserDto,
    );
  });

  it('should find all users', async () => {
    const users = [
      {
        _id: 'user1',
        username: 'user1',
        email: 'user1@example.com',
        password: 'password1',
      },
      {
        _id: 'user2',
        username: 'user2',
        email: 'user2@example.com',
        password: 'password2',
      },
    ];

    jest.spyOn(model, 'find').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(users as any),
    } as any);

    const result = await service.findAll();
    expect(result).toEqual(users);
  });

  it('should find one user by id', async () => {
    const userId = 'user1';
    const user = {
      _id: userId,
      username: 'user1',
      email: 'user1@example.com',
      password: 'password1',
    };

    jest.spyOn(model, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(user as any),
    } as any);

    const result = await service.findOne(userId);
    expect(result).toEqual(user);
  });

  it('should fetch user data from external API', async () => {
    const userId = '1';
    const apiResponse = {
      data: {
        id: 1,
        email: 'externaluser@example.com',
        username: 'externaluser',
      },
    };

    mockedAxios.get.mockResolvedValueOnce({ data: apiResponse });

    const result = await service.findOneFromAPI(userId);
    expect(result).toEqual(apiResponse.data);
  });

  it('should remove a user by id', async () => {
    const userId = '1';
    const deleteResult = await service.remove(userId);
    expect(deleteResult).toBeUndefined();
    expect(model.findByIdAndDelete).toHaveBeenCalledWith(userId);
  });
});
