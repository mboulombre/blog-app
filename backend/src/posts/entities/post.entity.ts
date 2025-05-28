import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('posts')
export class Post {
  @ApiProperty({ example: 1, description: 'Identifiant unique du post' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Mon premier article', description: 'Titre du post' })
  @Column()
  title: string;

  @ApiProperty({ example: 'mon-premier-article', description: 'Slug URL-friendly unique' })
  @Column({ unique: true })
  slug: string;

  @ApiProperty({ example: 'Voici le contenu de l’article...', description: 'Contenu complet du post' })
  @Column('text')
  content: string;

  @ApiProperty({ example: false, description: 'Détermine si le post est publié' })
  @Column({ default: false })
  isPublished: boolean;

  @ApiProperty({ example: '2025-05-27T14:00:00Z', description: 'Date de publication du post', required: false })
  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;


  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL de l’image d’illustration', required: false })
  @Column({ nullable: true })
  imageUrl: string;

  @ApiProperty({ description: 'Auteur du post (utilisateur)', type: () => User })
  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  author: User;

 @ApiProperty({ type: () => [Comment], description: 'Commentaires associés au post' })
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @ApiProperty({ example: '2025-05-27T12:00:00Z', description: 'Date de création' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2025-05-27T13:00:00Z', description: 'Date de dernière mise à jour' })
  @UpdateDateColumn()
  updatedAt: Date;
}
