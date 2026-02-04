import { Args, Int, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Lead } from './lead.entity';
import { CreateLeadInput } from './create-lead.input';
import { LeadsService } from '../leads.service';
import { ServiceType } from './service-type.entity';
import { Query } from '@nestjs/graphql';
import { ListLeadsInput } from './list-leads.input';
import { ListLeadsOutput } from './list-leads-output.model';
import { UseGuards } from '@nestjs/common';
import { AuthenticatedUserGuard } from '../../auth/enhancers/authenticated-user.guard';

@Resolver(() => Lead)
export class LeadsResolver {
  constructor(private readonly leadsService: LeadsService) {}

  @Mutation(() => Lead, { name: 'register', description: 'Create a new lead' })
  async createLead(
    @Args('newLeadData', { description: 'Data for the new lead' }) newLeadData: CreateLeadInput,
  ) {
    return this.leadsService.createLead(newLeadData);
  }

  @Query(() => ListLeadsOutput, { name: 'leads', description: 'List all leads' })
  async listLeads(
    @Args('listLeadsInput', {
      type: () => ListLeadsInput,
      description: 'Pagination input for listing leads',
    })
    listLeadsInput: ListLeadsInput,
  ) {
    return this.leadsService.listLeads(listLeadsInput);
  }

  @UseGuards(AuthenticatedUserGuard)
  @Query(() => ListLeadsOutput, {
    name: 'leadsWithAuth',
    description:
      'Same as the leads query, but provides auth for demo purposes, as expected of a prod backend.',
  })
  async authenticatedListLeads(
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

  @Query(() => Lead, {
    name: 'lead',
    description: 'Get a lead by ID. Will return null if no lead found.',
    nullable: true,
  })
  async getLeadById(
    @Args({ name: 'id', type: () => Int, description: 'ID of the lead to retrieve' }) id: number,
  ) {
    return await this.leadsService.getLeadById(id);
  }
}
