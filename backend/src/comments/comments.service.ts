import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
  ) {}

  async create(dto: CreateCommentDto, user: User): Promise<Comment> {
    const post = await this.postRepo.findOne({ where: { id: dto.postId } });
    if (!post) throw new NotFoundException('Post not found');

    const comment = this.commentRepo.create({
      content: dto.content,
      author: user,
      post,
    });
    return this.commentRepo.save(comment);
  }

  findAllByPost(postId: number) {
    return this.commentRepo.find({
      where: { post: { id: postId } },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, dto: UpdateCommentDto, user: User): Promise<Comment> {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException();

    if (comment.author.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException();
    }

    comment.content = dto.content;
    return this.commentRepo.save(comment);
  }

  async remove(id: number, user: User) {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException();

    if (comment.author.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException();
    }

    return this.commentRepo.remove(comment);
  }
}
