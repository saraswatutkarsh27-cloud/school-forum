import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Thread } from './thread.schema';
import { CreateThreadDto } from './dto/create-thread.dto';
import { Category } from '../categories/category.schema';
import { Post } from '../posts/post.schema';

@Injectable()
export class ThreadService {
  constructor(
    @InjectModel(Thread.name) private readonly threadModel: Model<Thread>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async resolveCategoryIdBySlug(slug: string): Promise<string> {
    const category = await this.categoryModel.findOne({ slug }).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return (category._id as Types.ObjectId).toHexString();
  }

  async listThreadsByCategorySlug(slug: string): Promise<Thread[]> {
    const category = await this.categoryModel.findOne({ slug }).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.threadModel
      .find({ categoryId: category._id })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getThreadById(id: string): Promise<Thread> {
    const thread = await this.threadModel.findById(id).exec();
    if (!thread) {
      throw new NotFoundException('Thread not found');
    }
    return thread;
  }

  async createThread(
    dto: CreateThreadDto,
    authorId: string,
  ): Promise<{ thread: Thread; firstPost: Post }> {
    const category = await this.categoryModel.findById(dto.categoryId).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const thread = new this.threadModel({
      title: dto.title,
      categoryId: category._id,
      authorId,
    });
    await thread.save();

    const firstPost = new this.postModel({
      threadId: thread._id,
      authorId,
      content: dto.initialPostContent,
    });
    await firstPost.save();

    return { thread, firstPost };
  }
}

