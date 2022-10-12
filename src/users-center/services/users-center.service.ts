import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UsersCenterEntity } from '../entities/users-center.entity';
import { ChangeRoleDto } from '../../users/dtos/change-role.dto';
import { UsersRegisterDto } from '../../users/dtos/users-register.dto';

@Injectable()
export class UsersCenterService {
  constructor(
    @InjectRepository(UsersCenterEntity)
    private readonly userCenterRepo: Repository<UsersCenterEntity>,
  ) {}

  async update(id: number, data) {
    return await this.userCenterRepo.update(id, data);
  }

  async save(data: any) {
    return (await this.userCenterRepo.save(data)) as any as UsersCenterEntity;
  }

  create(data: any) {
    return this.userCenterRepo.create(data);
  }

  async register(dto: UsersRegisterDto) {
    const user = this.userCenterRepo.create(dto);
    return await this.userCenterRepo.save(user);
  }

  async findByOpts(options: FindOneOptions<UsersCenterEntity>) {
    return await this.userCenterRepo.findOne(options);
  }

  async findUserById(id: number, options?: FindOneOptions<UsersCenterEntity>) {
    return await this.userCenterRepo.findOne({
      ...{ where: { id } },
      ...options,
    });
  }

  async getUserByPag(query) {
    return await this.userCenterRepo.find({
      skip: query.offset || 0,
      take: query.limit || 20,
      relations: ['tariffs', 'tariffs.tariff'],
    });
  }

  async changeRole(id: number, dto: ChangeRoleDto) {
    return await this.userCenterRepo.update(id, { role: dto.role });
  }

  async deleteUser(id: number) {
    return await this.userCenterRepo.delete(id);
  }
}
