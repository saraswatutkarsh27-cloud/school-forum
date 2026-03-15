import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { DecodedIdToken } from 'firebase-admin/auth';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findOrCreateFromToken(token: DecodedIdToken): Promise<User> {
    const firebaseUid = token.uid;

    let user = await this.userModel.findOne({ firebaseUid }).exec();
    if (!user) {
      user = new this.userModel({
        firebaseUid,
        displayName: token.name,
        email: token.email,
        photoURL: token.picture,
      });
      await user.save();
    } else {
      const needsUpdate =
        user.displayName !== token.name ||
        user.email !== token.email ||
        user.photoURL !== token.picture;

      if (needsUpdate) {
        user.displayName = token.name ?? user.displayName;
        user.email = token.email ?? user.email;
        user.photoURL = token.picture ?? user.photoURL;
        await user.save();
      }
    }

    return user;
  }
}

