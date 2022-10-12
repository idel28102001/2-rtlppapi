import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TariffsEntity } from './tariffs.entity';
import { UsersCenterEntity } from '../../users-center/entities/users-center.entity';

@Entity({ name: 'tariff-user' })
export class TariffUserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => TariffsEntity, (tariff) => tariff.user)
  tariff: TariffsEntity;

  @Column('date')
  expiresAt: Date;

  @ManyToOne(() => UsersCenterEntity, (user) => user.tariffs)
  user: UsersCenterEntity;
}
