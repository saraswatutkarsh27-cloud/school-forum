import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateThreadDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  initialPostContent!: string;

  @IsMongoId()
  @IsNotEmpty()
  categoryId!: string;
}

