import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TariffsEntity } from './tariffs.entity';

@Entity({ name: 'sub-tariff' })
export class SubTariffEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  duration: number;

  @Column()
  cost: number;

  @Column()
  currency: string;

  @ManyToOne(() => TariffsEntity, (tariff) => tariff.tariffs)
  tariffs: TariffsEntity;
}
