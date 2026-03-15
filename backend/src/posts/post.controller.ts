import {
  Body,
  Controller,
  Get,
  Param,
  Post as HttpPost,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { DecodedIdToken } from 'firebase-admin/auth';
import { CreatePostDto } from './dto/create-post.dto';
import { Types } from 'mongoose';

@Controller('threads/:threadId/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async list(@Param('threadId') threadId: string) {
    const posts = await this.postService.listByThreadId(threadId);
    return posts.map((p) => ({
      id: p.id,
      content: p.content,
      threadId: p.threadId,
      authorId: p.authorId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }

  @HttpPost()
  @UseGuards(FirebaseAuthGuard)
  async create(
    @Param('threadId') threadId: string,
    @Body() body: { content: string },
    @CurrentUser() token: DecodedIdToken,
  ) {
    const dto: CreatePostDto = {
      threadId,
      content: body.content,
    };

    const authorId = new Types.ObjectId(token.uid.substring(0, 24).padEnd(24, '0'));
    const post = await this.postService.createPost(dto, authorId);

    return {
      id: post.id,
      content: post.content,
      threadId: post.threadId,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}

