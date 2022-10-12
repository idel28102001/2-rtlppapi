import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../enums/role.enum';
import * as bcrypt from 'bcrypt';
import { TariffUserEntity } from '../../tariff/entities/tariff-user.entity';
import { PaymentEntity } from '../../payments/entities/payment.entity';

@Entity({ name: 'users-center' })
export class UsersCenterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;
  @Column({ default: Role.USER })
  role: Role;
  @OneToMany(() => TariffUserEntity, (tariff) => tariff.user, {
    nullable: true,
  })
  tariffs: TariffUserEntity[];
  @OneToMany(() => PaymentEntity, (payment) => payment.user, {
    cascade: true,
  })
  payments: PaymentEntity[];

  @Column({ default: false })
  onetimewas: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (this.password) {
      const salt = bcrypt.genSaltSync(10);
      this.password = bcrypt.hashSync(this.password, salt);
    }
  }
}
