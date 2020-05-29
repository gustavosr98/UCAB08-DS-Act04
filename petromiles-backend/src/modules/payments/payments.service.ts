import { Interest } from './interest.interface';
import { TransactionType } from './../transaction/transaction/transaction.enum';
import { PointsConversionService } from '@/modules/management/points-conversion/points-conversion.service';
import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { getConnection } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// SERVICES
import { BankAccountService } from '../bank-account/bank-account.service';
import { TransactionService } from '../transaction/transaction.service';
import { ThirdPartyInterestService } from '../management/third-party-interest/third-party-interest.service';
import { PlatformInterestService } from '../management/platform-interest/platform-interest.service';
import { PaymentProviderService } from '@/modules/payment-provider/payment-provider.service';
import { MailsService } from '../mails/mails.service';

// ENTITIES
import { Transaction } from '../transaction/transaction/transaction.entity';
import { UserService } from '../user/user.service';
import { PlatformInterest } from '../management/platform-interest/platform-interest.enum';
import { UserClient } from '../user/user-client/user-client.entity';
import { PointsConversion } from '../management/points-conversion/points-conversion.entity';

// INTERFACES
import { Suscription } from '../suscription/suscription/suscription.enum';
import { ApiModules } from '@/logger/api-modules.enum';
import { PaymentProvider } from './../payment-provider/payment-provider.enum';
import { MailsSubject, MailsTemplate } from '../mails/mails.enum';
import { Language } from '../user/language/language.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private bankAccountService: BankAccountService,
    private transactionService: TransactionService,
    private thirdPartyInterestService: ThirdPartyInterestService,
    private platformInterestService: PlatformInterestService,
    private userService: UserService,
    private pointsConversionService: PointsConversionService,
    private paymentProviderService: PaymentProviderService,
    private mailsService: MailsService,
    private configService: ConfigService,
  ) {}

  async getOnePointToDollars(): Promise<PointsConversion> {
    const mostRecentRate = await this.pointsConversionService.getRecentPointsConversion();
    return mostRecentRate;
  }

  async getInterests(trasactionType: TransactionType): Promise<Interest[]> {
    let interests: Interest[] = [];
    const thirdPartyInterest = await this.thirdPartyInterestService.get(
      PaymentProvider.STRIPE,
      trasactionType,
    );
    interests.push({
      operation: 1,
      amount: thirdPartyInterest.amountDollarCents || 0,
      percentage: thirdPartyInterest.percentage || 0,
    });

    const platformInterest = await this.platformInterestService.getInterestByName(
      PlatformInterest.BUY,
    );
    interests.push({
      operation: 1,
      amount: parseFloat(platformInterest.amount) || 0,
      percentage: parseFloat(platformInterest.percentage) || 0,
    });

    return interests;
  }

  async buyPoints(
    idUserClient: number,
    idClientBankAccount: number,
    amount,
    amountToCharge,
  ): Promise<Transaction> {
    const clientBankAccount = await this.bankAccountService.getClientBankAccount(
      idUserClient,
      idClientBankAccount,
    );

    const charge = await this.paymentProviderService.createCharge({
      customer: clientBankAccount.userClient.userDetails.customerId,
      source: clientBankAccount.chargeId,
      currency: 'usd',
      amount: amountToCharge,
    });

    let currentUserSuscription = clientBankAccount.userClient.userSuscription.find(
      suscription => !suscription.finalDate,
    );

    const extraPointsType = this.chooseExtraPoints(
      currentUserSuscription.suscription.name,
    );

    const deposit = await this.transactionService.createDeposit(
      clientBankAccount,
      extraPointsType,
      amount,
      charge.id,
    );

    this.logger.silly(
      `[${ApiModules.PAYMENTS}] Bank account {client: ${
        clientBankAccount.userClient.email
      } | id: ${idClientBankAccount} | last4: ${clientBankAccount.bankAccount.accountNumber.substr(
        -4,
      )}} charged with USD [raw ${(amount / 100).toFixed(2)}| total ${(
        amountToCharge / 100
      ).toFixed(2)}]`,
    );

    return deposit;
  }

  async withdrawPoints(
    user,
    idClientBankAccount,
    amount,
  ): Promise<Transaction> {
    const { id, email } = user;
    const clientBankAccount = await this.bankAccountService.getClientBankAccount(
      id,
      idClientBankAccount,
    );

    if (await this.verifyEnoughPoints(email, amount)) {
      return this.transactionService.createWithdrawalTransaction(
        clientBankAccount,
        amount,
      );
    }

    this.logger.error(
      `[${ApiModules.PAYMENTS}] {${email}} does not have enough points`,
    );
    throw new BadRequestException(`{${email}} does not have enough points`);
  }

  private chooseExtraPoints(suscriptionType): PlatformInterest {
    if (suscriptionType == Suscription.BASIC) return null;
    if (suscriptionType == Suscription.PREMIUM)
      return PlatformInterest.PREMIUM_EXTRA;
    return PlatformInterest.GOLD_EXTRA;
  }

  // Only verify points of valid transactions
  private async verifyEnoughPoints(email: string, amount: number) {
    const { dollars } = await this.userService.getPoints(email);
    const thirdPartyInterest = await this.thirdPartyInterestService.get(
      PaymentProvider.STRIPE,
      TransactionType.WITHDRAWAL,
    );
    const platformInterest = (
      await this.platformInterestService.getInterestByName(
        PlatformInterest.WITHDRAWAL,
      )
    ).percentage;

    // Calculate total amount of interests
    const interests =
      thirdPartyInterest.amountDollarCents +
      parseFloat(platformInterest) * amount;

    if (dollars * 100 >= interests) return true;

    return false;
  }

  async sendInvoiceEmail(user, file) {
    let userClient = await getConnection()
      .getRepository(UserClient)
      .findOne({ email: user.email });

    const template =
      userClient.userDetails.language.name === Language.ENGLISH
        ? MailsTemplate.INVOICE_EN
        : MailsTemplate.INVOICE_ES;

    const subject =
      userClient.userDetails.language.name === Language.ENGLISH
        ? MailsSubject.INVOICE_EN
        : MailsSubject.INVOICE_ES;

    this.mailsService.sendEmail({
      to: userClient.email,
      subject: subject,
      templateId: this.configService.get(
        `mails.sendgrid.templates.${template}`,
      ),
      dynamic_template_data: { user: userClient.userDetails.firstName },
      attachments: [
        {
          filename: `PetroMiles[invoice]-${new Date().toLocaleDateString()}`,
          type: file.mimetype,
          content: file.buffer.toString('base64'),
        },
      ],
    });
  }
}
