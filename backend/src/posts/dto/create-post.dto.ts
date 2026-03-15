import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsMongoId()
  @IsNotEmpty()
  threadId!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}

