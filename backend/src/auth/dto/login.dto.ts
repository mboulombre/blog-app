import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO (Data Transfer Object) for user authentication.
 * Contains the fields required to make a connection.
 */
export class LoginDto {
 
  @ApiProperty({
    example: 'user@example.com',
    description: 'Adresse email de l’utilisateur',
    type: String,
    format: 'email',
  })
  @IsEmail({}, { message: 'Adresse email invalide' })
  email: string;


  @ApiProperty({
    example: 'password123',
    description: 'Mot de passe de l’utilisateur',
    type: String,
  })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  password: string;
}

