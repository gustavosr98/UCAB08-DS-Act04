import { Transaction } from '../../transaction/transaction/transaction.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

@Entity()
export class PointsConversion extends BaseEntity {
  @PrimaryGeneratedColumn()
  idPointsConversion: number;

  @Column('decimal', { precision: 10, scale: 5 })
  onePointEqualsDollars: number;

  @Column({ default: () => 'CURRENT_DATE' })
  initialDate: Date;

  @Column({ nullable: true })
  finalDate: Date;

  @OneToMany(
    type => Transaction,
    transaction => transaction.pointsConversion,
    { nullable: true },
  )
  transaction: Transaction[];
}