import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { NotificationService } from 'src/notification/notification.service';
import axios from 'axios';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    this.logger.debug(`User created ${createdUser.userId}`);

    this.notificationService.sendToEmailService(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findOneFromAPI(id: string): Promise<any> {
    try {
      const response = await axios.get(
        `${process.env.USER_SERVICE_URL}/api/users/${id}`,
      );
      return response.data;
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.debug(`Deletion of User ${id}`);
    await this.userModel.findByIdAndDelete(id).exec();
  }
}
