import { HttpException, HttpStatus } from '@nestjs/common';

export class NotificationUserException extends HttpException {
  constructor(id: string, message: string, status: HttpStatus) {
    super(`Error in notification for User with ID ${id}: ${message}`, status);
  }
}
