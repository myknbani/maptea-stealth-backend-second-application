import { Module } from '@nestjs/common';
import { Config } from './config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [Config],
  exports: [Config],
})
export class AppConfigModule {}
