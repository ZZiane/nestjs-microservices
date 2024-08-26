import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto';
import { AvatarService } from '../avatar/avatar.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly avatarService: AvatarService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return user;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOneFromAPI(id);
  }

  @Get(':id/avatar')
  async getAvatar(@Param('id') id: string) {
    return this.avatarService.getAvatar(id);
  }

  @Delete(':id/avatar')
  async deleteAvatar(@Param('id') id: string) {
    return this.avatarService.deleteAvatar(id);
  }
}
