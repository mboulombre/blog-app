import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    // This service will handle user-related business logic
    // For example, you can add methods to create, update, delete, and retrieve users
    // Each method can interact with the database or other services as needed
    
    constructor( @InjectRepository(User)
    private readonly usersRepository: Repository<User>) {}
    
    /**
     * Retrieves all users from the repository.
     *
     * @returns A promise that resolves to an array of all `User` entities.
     * @throws {Error} Throws an error if users cannot be fetched.
     */
   async  findAll(): Promise<User[]> {
        try {
          let getAllUsers = this.usersRepository.find();
            return getAllUsers;
        } catch (error) {
            throw new Error('Could not fetch users'+ error);
        }
    }

    /**
     * Retrieves a user by their ID.
     *
     * @param id - The ID of the user to retrieve.
     * @returns A promise that resolves to the `User` entity if found, or null if not found.
     * @throws {Error} Throws an error if the user cannot be fetched.
     */
    async findOne(id:  number): Promise<User | null> {
        try {
           let  getUser =  this.usersRepository.findOne({ where: { id } });
            if(!getUser)  throw new  NotFoundException('User not found');
            return getUser;
        } catch (error) {
            throw new Error('Could not fetch user with ID ' + id + ': ' + error);
        }
    }


      async findByEmail(email: string): Promise<User | undefined> {
     try {
           let  getUser = this.usersRepository.findOne({ where: { email } });
             if (!getUser) throw new  NotFoundException('User not found');
            return getUser;
     } catch (error) {
            throw new Error('Could not fetch user with email ' + email + ': ' + error);
     }
  }

    /**
     * Creates a new user in the repository.
     *
     * @param user - The `User` entity to create.
     * @returns A promise that resolves to the created `User` entity.
     * @throws {Error} Throws an error if the user cannot be created.
     */
      async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

}
