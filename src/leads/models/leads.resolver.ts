import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Lead } from './lead.entity';
import { CreateLeadInput } from './create-lead.input';
import { LeadsService } from '../leads.service';
import { ServiceType } from './service-type.entity';
import { Query } from '@nestjs/graphql';
import { ListLeadsInput } from './list-leads.input';

@Resolver(() => Lead)
export class LeadsResolver {
  constructor(private readonly leadsService: LeadsService) {}

  @Mutation(() => Lead, { name: 'createLead', description: 'Create a new lead' })
  async createLead(
    @Args('newLeadData', { description: 'Data for the new lead' }) newLeadData: CreateLeadInput,
  ) {
    return this.leadsService.createLead(newLeadData);
  }

  @Query(() => [Lead], { name: 'leads', description: 'List all leads' })
  async listLeads(
    @Args('listLeadsInput', {
      type: () => ListLeadsInput,
      description: 'Pagination input for listing leads',
    })
    listLeadsInput: ListLeadsInput,
  ) {
    return this.leadsService.listLeads(listLeadsInput);
  }

  @ResolveField(() => [ServiceType], { description: 'Service types the lead is interested in' })
  async serviceTypes(@Parent() lead: Lead) {
    return await lead.serviceTypes.load();
  }
}
