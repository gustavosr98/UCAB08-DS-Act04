import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// MODULES

// SERVICES
import { PlatformInterestService } from './platform-interest/platform-interest.service';
import { PointsConversionService } from './points-conversion/points-conversion.service';
import { ThirdPartyInterestService } from './third-party-interest/third-party-interest.service';
import { RoleService } from './role/role.service';
import { StateService } from './state/state.service';

// ENTITIES
import { State } from './state/state.entity';
import { Role } from './role/role.entity';
import { PlatformInterest } from './platform-interest/platform-interest.entity';
import { PointsConversion } from './points-conversion/points-conversion.entity';
import { Language } from '../user/language/language.entity';
import { ThirdPartyInterest } from './third-party-interest/third-party-interest.entity';
import { ManagementController } from './management.controller';
import { ManagementService } from './management.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      State,
      Role,
      PlatformInterest,
      PointsConversion,
      ThirdPartyInterest,
      Language,
    ]),
  ],
  providers: [
    StateService,
    RoleService,
    PlatformInterestService,
    PointsConversionService,
    ThirdPartyInterestService,
    ManagementService,
  ],
  exports: [
    StateService,
    RoleService,
    TypeOrmModule.forFeature([State]),
    PlatformInterestService,
    PointsConversionService,
    ThirdPartyInterestService,
  ],
  controllers: [ManagementController],
})
export class ManagementModule {}
