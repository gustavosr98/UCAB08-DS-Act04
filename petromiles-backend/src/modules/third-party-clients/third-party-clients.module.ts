import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ENTITIES
import { ThirdPartyClient } from '@/entities/third-party-client.entity';

// MODULES
import { PaymentsModule } from '@/modules/payments/payments.module';
import { ManagementModule } from '@/modules/management/management.module';

// CONTROLLERS
import { ThirdPartyClientsController } from '@/modules/third-party-clients/controllers/third-party-clients.controller';

// SERVICES
import { ThirdPartyClientsService } from '@/modules/third-party-clients/services/third-party-clients.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ThirdPartyClient]),
    ManagementModule,
    PaymentsModule,
  ],
  controllers: [ThirdPartyClientsController],
  providers: [ThirdPartyClientsService],
})
export class ThirdPartyClientsModule {}
