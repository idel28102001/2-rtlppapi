import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentsEnums } from '../enums/payments.enums';
import { UsersCenterEntity } from '../../users-center/entities/users-center.entity';

@Entity({ name: 'payments' })
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', nullable: true })
  paymentId: string;

  @Column()
  currency: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  expiresAt: Date;

  @Column()
  amount: string;

  @Column()
  status: PaymentsEnums;

  @Column()
  redirectUrl: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @ManyToOne(() => UsersCenterEntity, (user) => user.payments, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  user: UsersCenterEntity;
}
