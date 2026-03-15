import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './post.schema';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Thread, ThreadSchema } from '../threads/thread.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Thread.name, schema: ThreadSchema },
    ]),
  ],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}

