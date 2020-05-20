import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageSeederService } from './language.service';
import { Language } from '../../../modules/user/language/language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  providers: [LanguageSeederService],
  exports: [LanguageSeederService],
})
export class LanguageSeederModule {}
