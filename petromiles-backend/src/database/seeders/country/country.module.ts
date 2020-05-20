import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountrySeederService } from './country.service';
import { Country } from '../../../modules/management/country/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  providers: [CountrySeederService],
  exports: [CountrySeederService],
})
export class CountrySeederModule {}
