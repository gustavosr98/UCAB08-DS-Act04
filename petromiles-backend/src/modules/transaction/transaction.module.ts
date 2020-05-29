import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// CONTROLLER
import { TransactionController } from './transaction.controller';

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
import { StateTransaction } from './state-transaction/state-transaction.entity';

@Module({
  imports: [
    PaymentProviderModule,
    ManagementModule,
    PaymentProviderModule,
    TypeOrmModule.forFeature([
      Transaction,
      TransactionInterest,
      StateTransaction,
    ]),
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
  ],
  controllers: [TransactionController],
})
export class TransactionModule {}