import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';


export type UserRole = 'user' | 'admin';
@Entity('users')
export class User {
  @ApiProperty({ example: 1, description: "Identifiant unique de l'utilisateur" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'johndoe@example.com', description: "Adresse e-mail de l'utilisateur" })
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'Mot de passe de l’utilisateur', writeOnly: true })
  @IsString()
  @Exclude()
  @Column({ select: false })
  password: string;

  @ApiProperty({ example: 'John', description: "Prénom de l'utilisateur", required: false })
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: "Nom de famille de l'utilisateur", required: false })
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', default: 'user' })
  role: UserRole;

  @ApiProperty({ example: '2025-05-27T14:00:00Z', description: 'Date de création' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2025-05-27T14:30:00Z', description: 'Date de dernière modification' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty({ type: () => [Comment], description: "Commentaires de l'utilisateur" })
  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

@OneToMany(() => Post, (post) => post.author)
@ApiProperty({
  type: () => [Post],
  description: 'Liste des posts écrits par l’utilisateur',
})
posts: Post[];
}
