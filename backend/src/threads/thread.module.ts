import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Thread, ThreadSchema } from './thread.schema';
import { ThreadService } from './thread.service';
import { ThreadController } from './thread.controller';
import { Category, CategorySchema } from '../categories/category.schema';
import { Post, PostSchema } from '../posts/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Thread.name, schema: ThreadSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  providers: [ThreadService],
  controllers: [ThreadController],
})
export class ThreadModule {}

