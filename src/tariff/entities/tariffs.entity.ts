import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubTariffEntity } from './sub-tariff.entity';
import { TariffUserEntity } from './tariff-user.entity';

@Entity({ name: 'tariffs' })
export class TariffsEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('boolean')
  oneTime: boolean;

  @Column()
  accessLevel: number;

  @OneToMany(() => TariffUserEntity, (user) => user.tariff)
  user: TariffUserEntity[];

  @OneToMany(() => SubTariffEntity, (tariff) => tariff.tariffs, {
    cascade: true,
  })
  tariffs: SubTariffEntity[];
}
