import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseAdminModule } from './firebase/firebase-admin.module';
import { UserModule } from './users/user.module';
import { CategoryModule } from './categories/category.module';
import { ThreadModule } from './threads/thread.module';
import { PostModule } from './posts/post.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI') as string,
      }),
    }),
    FirebaseAdminModule,
    UserModule,
    CategoryModule,
    ThreadModule,
    PostModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

