import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty( { example: 'Mon premier article', description: 'Titre du post' })
  @IsNotEmpty()
  title: string;

  @ApiProperty( { example: 'mon-premier-article', description: 'Slug URL-friendly unique' })
  @IsNotEmpty()
  content: string;
}
