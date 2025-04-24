import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { RegisterRequestDto } from '../dto/request/register-request.dto';
import { User } from '../entities/user.entity';

export interface IUserRepository {
  findById(id: string, entityManager?: EntityManager): Promise<User | null>;
  findByEmail(
    email: string,
    entityManager?: EntityManager,
  ): Promise<User | null>;
  save(user: User, entityManager?: EntityManager): Promise<User>;
  create(
    registerDto: RegisterRequestDto,
    hashedPassword: string,
    entityManager?: EntityManager,
  ): Promise<User>;
  updateRefreshToken(
    userId: string,
    refreshToken: string,
    entityManager?: EntityManager,
  ): Promise<void>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private dataSource: DataSource) {}

  private getManager(entityManager?: EntityManager): EntityManager {
    return entityManager || this.dataSource.manager;
  }

  async findById(
    id: string,
    entityManager?: EntityManager,
  ): Promise<User | null> {
    const manager = this.getManager(entityManager);
    return manager.findOne(User, { where: { id } });
  }

  async findByEmail(
    email: string,
    entityManager?: EntityManager,
  ): Promise<User | null> {
    const manager = this.getManager(entityManager);
    return manager.findOne(User, { where: { email } });
  }

  async save(user: User, entityManager?: EntityManager): Promise<User> {
    const manager = this.getManager(entityManager);
    return manager.save(User, user);
  }

  async create(
    registerDto: RegisterRequestDto,
    hashedPassword: string,
    entityManager?: EntityManager,
  ): Promise<User> {
    const manager = this.getManager(entityManager);
    const user = manager.create(User, {
      email: registerDto.email,
      password: hashedPassword,
      nickname: registerDto.name,
    });
    return manager.save(User, user);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
    entityManager?: EntityManager,
  ): Promise<void> {
    const manager = this.getManager(entityManager);
    await manager.update(User, { id: userId }, { refreshToken });
  }
}
