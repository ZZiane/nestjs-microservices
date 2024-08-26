import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AvatarService } from '../avatar/avatar.service';
import { CreateUserDto } from './dto';
import { Types } from 'mongoose';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let avatarService: AvatarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findOneFromAPI: jest.fn(),
          },
        },
        {
          provide: AvatarService,
          useValue: {
            getAvatar: jest.fn(),
            deleteAvatar: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    avatarService = module.get<AvatarService>(AvatarService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };
    const createdUser = { userId: new Types.ObjectId(), ...createUserDto };

    jest.spyOn(userService, 'create').mockResolvedValueOnce(createdUser);

    const result = await controller.create(createUserDto);
    expect(result).toEqual(createdUser);
  });

  it('should fetch a user from external API', async () => {
    const userId = '1';
    const apiResponse = {
      data: {
        id: 1,
        email: 'george.bluth@reqres.in',
        first_name: 'George',
        last_name: 'Bluth',
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
      },
      support: {
        url: 'https://reqres.in/#support-heading',
        text: 'To keep ReqRes free, contributions towards server costs are appreciated!',
      },
    };

    jest
      .spyOn(userService, 'findOneFromAPI')
      .mockResolvedValueOnce(apiResponse);

    const result = await controller.findOne(userId);
    expect(result).toEqual(apiResponse);
  });

  it('should get avatar', async () => {
    const userId = '1';
    const base64Image = 'base64encodedimage';

    jest.spyOn(avatarService, 'getAvatar').mockResolvedValueOnce(base64Image);

    const result = await controller.getAvatar(userId);
    expect(result).toEqual(base64Image);
  });

  it('should delete avatar', async () => {
    const userId = '1';

    jest.spyOn(avatarService, 'deleteAvatar').mockResolvedValueOnce(undefined);

    await controller.deleteAvatar(userId);
    expect(avatarService.deleteAvatar).toHaveBeenCalledWith(userId);
  });
});
