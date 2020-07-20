import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { PaymentsService } from './payments.service';
import { PaymentProviderService } from '@/modules/payment-provider/payment-provider.service';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';
import { ThirdPartyInterestService } from '@/modules/management/services/third-party-interest.service';
import { PlatformInterestService } from '@/modules/management/services/platform-interest.service';
import { UserClientService } from '@/modules/user/services/user-client.service';
import { MailsService } from '@/modules/mails/mails.service';
import { SuscriptionService } from '@/modules/suscription/service/suscription.service';

import { Transaction } from '@/entities/transaction.entity';
import { ClientBankAccount } from '@/entities/client-bank-account.entity';

import { Interest } from '@/modules/payments/interest.interface';
import { PlatformInterest } from '@/enums/platform-interest.enum';
import { TransactionType } from '@/enums/transaction.enum';

import { TransactionModule } from '@/modules/transaction/transaction.module';
import { BankAccountModule } from '@/modules/bank-account/bank-account.module';
import { SuscriptionModule } from '@/modules/suscription/suscription.module';
import { UserModule } from '@/modules/user/user.module';
import { ManagementModule } from '@/modules/management/management.module';
import { PaymentProviderModule } from '@/modules/payment-provider/payment-provider.module';
import { MailsModule } from '@/modules/mails/mails.module';
import { WinstonModule } from 'nest-winston';
import createOptions from '../../../logger/winston/winston-config';

describe('PaymentsService', () => {
  let PaymentsServiceMock: jest.Mock<Partial<PaymentsService>>;
  let paymentsService: PaymentsService;
  let RepositoryMock: jest.Mock;
  let clientBankAccountRepository: Repository<ClientBankAccount>;
  let PaymentProviderServiceMock: jest.Mock<Partial<PaymentProviderService>>;
  let paymentProviderService: PaymentProviderService;
  let TransactionServiceMock: jest.Mock<Partial<TransactionService>>;
  let transactionService: TransactionService;
  let PointsConversionServiceMock: jest.Mock<Partial<PointsConversionService>>;
  let pointsConversionService: PointsConversionService;
  let ThirdPartyInterestServiceMock: jest.Mock<Partial<
    ThirdPartyInterestService
  >>;
  let thirdPartyInterestService: ThirdPartyInterestService;
  let PlatformInterestServiceMock: jest.Mock<Partial<PlatformInterestService>>;
  let platformInterestService: PlatformInterestService;

  beforeEach(() => {
    RepositoryMock = jest.fn(() => ({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }));
    PaymentsServiceMock = jest.fn<Partial<PaymentsService>, PaymentsService[]>(
      () => ({
        getInterests: jest.fn(),
        getOnePointToDollars: jest.fn(),
        verifyEnoughPoints: jest.fn(),
      }),
    );
    PaymentProviderServiceMock = jest.fn<
      Partial<PaymentProviderService>,
      PaymentProviderService[]
    >(() => ({
      updateBankAccountOfAnAccount: jest.fn(),
      createTransfer: jest.fn(),
    }));
    TransactionServiceMock = jest.fn<
      Partial<TransactionService>,
      TransactionService[]
    >(() => ({
      createWithdrawalTransaction: jest.fn(),
    }));
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WinstonModule.forRoot(
          createOptions({ fileName: 'petromiles-global.log' }),
        ),
      ],
      providers: [
        PaymentsService,
        TransactionService,
        PaymentProviderService,
        ThirdPartyInterestService,
        PlatformInterestService,
        UserClientService,
        PointsConversionService,
        MailsService,
        ConfigService,
        SuscriptionService,
        {
          provide: getRepositoryToken(ClientBankAccount),
          useValue: new RepositoryMock(),
        },
      ],
    }).compile();

    clientBankAccountRepository = module.get(
      getRepositoryToken(ClientBankAccount),
    );
    paymentProviderService = module.get<PaymentProviderService>(
      PaymentProviderService,
    );
    transactionService = module.get<TransactionService>(TransactionService);
    paymentsService = module.get<PaymentsService>(PaymentsService);
  });

  describe('withdrawPoints(user, idClientBankAccount, amount, amountToCharge, points)', () => {
    let user;
    let idClientBankAccount: number;
    let amount: number;
    let amountToCharge: number;
    let points: number;
    let expectedInterests: Interest[];
    let expectedOnePointToDollars: number;
    let expectedClientBankAccount;
    let expectedTransfer;
    let expectedTransaction: Partial<Transaction>;
    let result: Partial<Transaction>;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          user = { email: 'prueba@gmail.com', id: 1, role: 'CLIENT' };
          idClientBankAccount = 1;
          amount = 100;
          amountToCharge = 20;
          points = 500;

          expectedInterests = [
            { operation: 1, amount: 75, percentage: 0 },
            { operation: 1, amount: 0, percentage: 0.05 },
          ];
          expectedOnePointToDollars = 0.002;
          expectedClientBankAccount = {
            idClientBankAccount: 1,
            paymentProvider: 'STRIPE',
            chargeId: 'prueba',
            primary: false,
            transferId: 'prueba',
            userClient: {
              idUserClient: 1,
              email: 'prueba@gmail.com',
              userDetails: {
                idUserDetails: 1,
                firstName: 'prueba',
                lastName: 'prueba',
                customerId: 'prueba',
                accountId: 'prueba',
              },
            },
            bankAccount: {
              idBankAccount: 1,
              accountNumber: '1',
              checkNumber: '1111',
              nickname: 'prueba',
              type: 'Saving',
              routingNumber: {
                idRoutingNumber: 1,
                number: '1',
              },
            },
            stateBankAccount: [
              {
                idStateBankAccount: 1,
              },
            ],
          };
          expectedTransfer = {
            id: 'prueba',
            amount: 20,
          };
          expectedTransaction = {
            totalAmountWithInterest: 80,
            rawAmount: 100,
            clientBankAccount: expectedClientBankAccount,
          };

          (paymentsService.getInterests as jest.Mock).mockResolvedValue(
            expectedInterests,
          );
          (paymentsService.getOnePointToDollars as jest.Mock).mockResolvedValue(
            expectedOnePointToDollars,
          );
          // @ts-ignore
          (paymentsService.verifyEnoughPoints as jest.Mock).mockResolvedValue(
            true,
          );
          (clientBankAccountRepository.findOne as jest.Mock).mockResolvedValue(
            expectedClientBankAccount,
          );
          (paymentProviderService.createTransfer as jest.Mock).mockResolvedValue(
            expectedTransfer,
          );
          (transactionService.createWithdrawalTransaction as jest.Mock).mockResolvedValue(
            expectedTransaction,
          );

          result = await paymentsService.withdrawPoints(
            user,
            idClientBankAccount,
            amount,
            amountToCharge,
            points,
          );
        });

        it('should invoke paymentsService.getInterests()', () => {
          expect(paymentsService.getInterests).toHaveBeenCalledTimes(1);
          expect(paymentsService.getInterests).toHaveBeenCalledWith(
            TransactionType.WITHDRAWAL,
            PlatformInterest.WITHDRAWAL,
          );
        });

        it('should invoke paymentsService.getOnePointToDollars()', () => {
          expect(paymentsService.getOnePointToDollars).toHaveBeenCalledTimes(1);
        });

        it('should invoke paymentsService.verifyEnoughPoints()', () => {
          // @ts-ignore
          expect(paymentsService.verifyEnoughPoints).toHaveBeenCalledTimes(1);
          // @ts-ignore
          expect(paymentsService.verifyEnoughPoints).toHaveBeenCalledWith(
            user.id,
            amount,
          );
        });

        it('should invoke clientBankAccountRepository.findOne()', () => {
          expect(clientBankAccountRepository.findOne).toHaveBeenCalledTimes(1);
          expect(clientBankAccountRepository.findOne).toHaveBeenCalledWith(
            idClientBankAccount,
          );
        });

        it('should invoke paymentProviderService.updateBankAccountOfAnAccount()', () => {
          expect(
            paymentProviderService.updateBankAccountOfAnAccount,
          ).toHaveBeenCalledTimes(1);
          expect(
            paymentProviderService.updateBankAccountOfAnAccount,
          ).toHaveBeenCalledWith(
            expectedClientBankAccount.userClient.userDetails.accountId,
            expectedClientBankAccount.transferId,
            {
              default_for_currency: true,
            },
          );
        });

        it('should invoke paymentProviderService.createTransfer()', () => {
          expect(paymentProviderService.createTransfer).toHaveBeenCalledTimes(
            1,
          );
          expect(paymentProviderService.createTransfer).toHaveBeenCalledWith({
            destination:
              expectedClientBankAccount.userClient.userDetails.accountId,
            currency: 'usd',
            amount: Math.round(amountToCharge),
            source_type: 'bank_account',
          });
        });

        it('should invoke transactionService.createWithdrawalTransaction()', () => {
          expect(
            transactionService.createWithdrawalTransaction,
          ).toHaveBeenCalledTimes(1);
          expect(
            transactionService.createWithdrawalTransaction,
          ).toHaveBeenCalledWith(
            expectedClientBankAccount,
            amount,
            expectedTransfer.id,
          );
        });

        it('should return a transaction', () => {
          expect(result).toStrictEqual(expectedTransaction);
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when the user has no updated configuration parameters', () => {
        beforeEach(async () => {
          user = { email: 'prueba@gmail.com', id: 1, role: 'CLIENT' };
          idClientBankAccount = 1;
          amount = 100;
          amountToCharge = 20;
          points = 500;
          expectedError = new BadRequestException();

          jest
            .spyOn(paymentsService, 'withdrawPoints')
            .mockRejectedValue(expectedError);
        });

        it('should throw whenthe the user has no updated configuration parameters', async () => {
          await expect(
            paymentsService.withdrawPoints(
              user,
              idClientBankAccount,
              amount,
              amountToCharge,
              points,
            ),
          ).rejects.toThrow(BadRequestException);
        });

        it('should not invoke paymentsService.getInterests()', () => {
          expect(paymentsService.getInterests).not.toHaveBeenCalled();
        });

        it('should not invoke paymentsService.getOnePointToDollars()', () => {
          expect(paymentsService.getOnePointToDollars).not.toHaveBeenCalled();
        });

        it('should not invoke paymentsService.verifyEnoughPoints()', () => {
          // @ts-ignore
          expect(paymentsService.verifyEnoughPoints).not.toHaveBeenCalled();
        });

        it('should not invoke clientBankAccountRepository.findOne()', () => {
          expect(clientBankAccountRepository.findOne).not.toHaveBeenCalled();
        });

        it('should not invoke paymentProviderService.updateBankAccountOfAnAccount()', () => {
          expect(
            paymentProviderService.updateBankAccountOfAnAccount,
          ).not.toHaveBeenCalled();
        });

        it('should not invoke paymentProviderService.createTransfer()', () => {
          expect(paymentProviderService.createTransfer).not.toHaveBeenCalled();
        });

        it('should not invoke transactionService.createWithdrawalTransaction()', () => {
          expect(
            transactionService.createWithdrawalTransaction,
          ).not.toHaveBeenCalled();
        });
      });
    });
  });
});
