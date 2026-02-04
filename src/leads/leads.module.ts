import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Lead } from './models/lead.entity';
import { ServiceType } from './models/service-type.entity';
import { LeadInterest } from './models/lead-interest.entity';
import { LeadsResolver } from './models/leads.resolver';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Lead, ServiceType, LeadInterest]), // inject repositories
    AuthModule,
  ],
  providers: [LeadsService, LeadsResolver],
  exports: [],
})
export class LeadsModule {}
