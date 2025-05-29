import { Controller, Get, UseGuards, Post,Param, Body, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';  
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';


@ApiTags('Users')
@Controller('/users')

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Récupère tous les utilisateurs.
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Liste tous les utilisateurs' })
  @ApiResponse({
    status: 200,
    description: 'Liste récupérée avec succès',
    type: [User], // tableau d'entités User
  })
  async getAllUsers() {
      return await this.usersService.findAll();
  }


  @ApiOperation({ summary: 'Retour l\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'User récupéré avec succès',
    type: User, 
  })
   @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  @Get(':email')
  async getUserByemail ( @Param('email') email: string){
      return  await this.usersService.findByEmail(email);
  }

  

   @Patch(":id")
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  // @ApiCreatedResponse({
  //   description: 'Utilisateur créé avec succès',
  //   type: User,
  // })
  @ApiBadRequestResponse({
    description: 'Données invalides pour la création de l’utilisateur',
  })
  async update(@Param() id: number,  @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }
}
