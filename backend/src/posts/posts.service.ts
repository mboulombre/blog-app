import { Injectable, NotFoundException, ForbiddenException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postsRepo: Repository<Post>,
@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
      try {
            // let currentUser =  this.userRepo.findOne({where: {id: user.userId}});
         // Image aléatoire sur la technologie
         const randomImage = `https://source.unsplash.com/random/800x600?technology&sig=${Math.floor(Math.random() * 1000)}`;

            const post = this.postsRepo.create({ ...createPostDto, imageUrl: randomImage ?? "", slug:"blog_"+Date(), author: user });
            return this.postsRepo.save(post);
      } catch (error) {
         throw new HttpException('Error creating post', 500);
      }
  }

  findAll(page = 1, limit = 10) {
    return this.postsRepo.find({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Post> {
        try {
                const post = await this.postsRepo.findOne({ where: { id } });
                if (!post) throw new NotFoundException('Post not found');
            return post;
        } catch (error) {
            throw new HttpException('Error fetching post', 500);    
        }
  }

  async update(id: number, dto: UpdatePostDto, user: User): Promise<Post> {
    const post = await this.findOne(id);
    if (post.author.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException();
    }
    Object.assign(post, dto);
    return this.postsRepo.save(post);
  }

  async remove(id: number, user: User): Promise<void> {
    const post = await this.findOne(id);
    if (post.author.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException();
    }
    await this.postsRepo.remove(post);
  }
}
