import { Controller, Get, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserService } from './user.service';
import { DecodedIdToken } from 'firebase-admin/auth';

@Controller('me')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async getMe(@CurrentUser() token: DecodedIdToken) {
    const user = await this.userService.findOrCreateFromToken(token);
    return {
      id: user.id,
      firebaseUid: user.firebaseUid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };
  }
}

