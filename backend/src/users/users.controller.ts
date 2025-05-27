import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Récupère tous les utilisateurs.
   */
  @Get()
  @ApiOperation({ summary: 'Liste tous les utilisateurs' })
  @ApiResponse({
    status: 200,
    description: 'Liste récupérée avec succès',
    type: [User], // tableau d'entités User
  })
  async getAllUsers() {
    return this.usersService.findAll();
  }

  /**
   * Crée un nouvel utilisateur.
   */
  @Post()
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiCreatedResponse({
    description: 'Utilisateur créé avec succès',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Données invalides pour la création de l’utilisateur',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
