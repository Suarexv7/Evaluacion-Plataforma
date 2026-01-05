import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepo.create(createUserDto);
    return await this.usersRepo.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepo.find();
  }

  async findOne(id: number): Promise<User> {

    const user = await this.usersRepo.findOneBy({ id });
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    return user;
  }


  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepo.findOneBy({ email });
  }
}