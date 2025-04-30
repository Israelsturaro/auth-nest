// eslint-disable-next-line prettier/prettier
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './userDTO';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    username: string,
    password: string,
    email: string,
    telefone: string,
    role: string = 'USER',
  ): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await this.userRepository.findOne({
      where: [{ email }],
    });

    const emailInvalido = !/\S+@\S+\.\S+/.test(email);

    if (emailInvalido) {
      throw new HttpException('Email inválido', HttpStatus.BAD_REQUEST);
    }

    if (existingUser) {
      throw new HttpException('Email já cadastrado', HttpStatus.CONFLICT);
    }

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      role,
      email,
      telefone,
    });

    return this.userRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user ?? undefined;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
  async findById(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user ?? undefined;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuário ${id} não encontrado`);
    }
    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuário ${id} não encontrado`);
    }
  }
}
