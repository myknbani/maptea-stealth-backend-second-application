import { Module } from '@nestjs/common';
import { EnvConfig } from './env-config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [EnvConfig],
  exports: [EnvConfig],
})
export class AppConfigModule {}
