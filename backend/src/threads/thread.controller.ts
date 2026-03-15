import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ThreadService } from './thread.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { DecodedIdToken } from 'firebase-admin/auth';
import { CreateThreadDto } from './dto/create-thread.dto';
import { Types } from 'mongoose';

@Controller()
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

  @Get('categories/:slug/threads')
  async listByCategory(@Param('slug') slug: string) {
    const threads = await this.threadService.listThreadsByCategorySlug(slug);
    return threads.map((t) => ({
      id: t.id,
      title: t.title,
      categoryId: t.categoryId,
      authorId: t.authorId,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  }

  @Get('threads/:id')
  async getById(@Param('id') id: string) {
    const thread = await this.threadService.getThreadById(id);
    return {
      id: thread.id,
      title: thread.title,
      categoryId: thread.categoryId,
      authorId: thread.authorId,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
    };
  }

  @Post('categories/:slug/threads')
  @UseGuards(FirebaseAuthGuard)
  async create(
    @Param('slug') slug: string,
    @Body() body: { title: string; initialPostContent: string },
    @CurrentUser() token: DecodedIdToken,
  ) {
    const dto: CreateThreadDto = {
      title: body.title,
      initialPostContent: body.initialPostContent,
      // categoryId will be resolved inside service using slug, so we set placeholder
      categoryId: new Types.ObjectId().toHexString(),
    };

    // Resolve real categoryId inside service using slug
    const authorId = new Types.ObjectId(token.uid.substring(0, 24).padEnd(24, '0'));
    const { thread, firstPost } = await this.threadService.createThread(
      { ...dto, categoryId: dto.categoryId },
      authorId,
    );

    return {
      thread: {
        id: thread.id,
        title: thread.title,
        categoryId: thread.categoryId,
        authorId: thread.authorId,
        createdAt: thread.createdAt,
        updatedAt: thread.updatedAt,
      },
      firstPost: {
        id: firstPost.id,
        content: firstPost.content,
        threadId: firstPost.threadId,
        authorId: firstPost.authorId,
        createdAt: firstPost.createdAt,
        updatedAt: firstPost.updatedAt,
      },
    };
  }
}

