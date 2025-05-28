import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty( { example: 'Ceci est un commentaire', description: 'Contenu du commentaire' })
  @IsNotEmpty()
  content: string;

  @ApiProperty( { example: 1, description: 'Identifiant du post du commentaire' })
  @IsNotEmpty()
  postId: number;
}
