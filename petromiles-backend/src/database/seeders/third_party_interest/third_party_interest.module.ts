import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThirdPartyInterest } from '../../../modules/management/third-party-interest/third-party-interest.entity';
import { ThirdPartyInterestSeederService } from './third_party_interest.service';

@Module({
  imports: [TypeOrmModule.forFeature([ThirdPartyInterest])],
  providers: [ThirdPartyInterestSeederService],
  exports: [ThirdPartyInterestSeederService],
})
export class ThirdPartyInterestSeederModule {}
