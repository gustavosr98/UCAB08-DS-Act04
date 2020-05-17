import { StateUser } from '../../user/state-user/state-user.entity';
import { StateBankAccount } from '../../bank-account/state-bank-account/state-bank-account.entity';
import { StateTransaction } from '../../transaction/state-transaction/state-transaction.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

@Entity()
export class State extends BaseEntity {
  @PrimaryGeneratedColumn()
  idState: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(
    type => StateUser,
    stateUser => stateUser.state,
    { nullable: true },
  )
  stateUser?: StateUser[];

  @OneToMany(
    type => StateBankAccount,
    stateBankAccount => stateBankAccount.state,
    { nullable: true },
  )
  stateBankAccount?: StateBankAccount[];

  @OneToMany(
    type => StateTransaction,
    stateTransaction => stateTransaction.state,
    { nullable: true },
  )
  stateTransaction?: StateTransaction[];
}
