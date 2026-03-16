import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { Thread } from '../threads/thread.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Thread.name) private readonly threadModel: Model<Thread>,
  ) {}

  async listByThreadId(threadId: string): Promise<Post[]> {
    const thread = await this.threadModel.findById(threadId).exec();
    if (!thread) {
      throw new NotFoundException('Thread not found');
    }
    return this.postModel
      .find({ threadId: thread._id })
      .sort({ createdAt: 1 })
      .exec();
  }

  async createPost(
    dto: CreatePostDto,
    authorId: string,
  ): Promise<Post> {
    const thread = await this.threadModel.findById(dto.threadId).exec();
    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    const post = new this.postModel({
      threadId: thread._id,
      authorId,
      content: dto.content,
    });

    return post.save();
  }
}

