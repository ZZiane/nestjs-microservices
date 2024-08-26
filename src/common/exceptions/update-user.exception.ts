import { HttpException, HttpStatus } from '@nestjs/common';

export class UpdateUserException extends HttpException {
  constructor(id: string, message: string, status: HttpStatus) {
    super(`We can't update User with ID ${id} : ${message}`, status);
  }
}
