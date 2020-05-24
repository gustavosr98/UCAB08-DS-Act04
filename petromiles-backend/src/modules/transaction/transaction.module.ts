import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// MODULES
import { ManagementModule } from '../management/management.module';
import { PaymentProviderModule } from '@/modules/payment-provider/payment-provider.module';

// SERVICES
import { TransactionService } from './transaction.service';
import { TransactionInterestService } from './transaction-interest/transaction-interest.service';
import { StateTransactionService } from './state-transaction/state-transaction.service';

// ENTITIES
import { Transaction } from './transaction/transaction.entity';
import { TransactionInterest } from './transaction-interest/transaction-interest.entity';
@Module({
  imports: [
    ManagementModule,
    PaymentProviderModule,
    TypeOrmModule.forFeature([Transaction, TransactionInterest]),
  ],
  providers: [
    TransactionService,
    TransactionInterestService,
    StateTransactionService,
  ],
  exports: [
    TransactionService,
    TransactionInterestService,
    StateTransactionService,
    TypeOrmModule.forFeature([Transaction, TransactionInterest]),
  ],
})
export class TransactionModule {}
