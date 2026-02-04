import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateLeadInput } from './models/create-lead.input';
import { EntityManager } from '@mikro-orm/postgresql';
import { Lead } from './models/lead.entity';
import { ServiceType } from './models/service-type.entity';
import _ from 'lodash';
import { ListLeadsInput } from './models/list-leads.input';
import { PageInfo } from '../common/models/page-info.model';
import { ListLeadsOutput } from './models/list-leads-output.model';

/**
 * Service to manage leads.
 */
@Injectable()
export class LeadsService {
  constructor(private readonly entityManager: EntityManager) {}

  /**
   * Creates a new lead.
   *
   * @param leadData a DTO for the new lead that should already be validated
   * @returns A promise that resolves to the created lead
   */
  async createLead(leadData: CreateLeadInput) {
    const uniqueServiceTypeNames = _.uniq(leadData.serviceTypeNames);
    const serviceTypes = await this.entityManager.find(ServiceType, {
      name: { $in: uniqueServiceTypeNames },
    });

    if (_.isEmpty(serviceTypes)) {
      throw new UnprocessableEntityException('At least one valid service type must be provided.');
    }

    const lead = new Lead({ ...leadData });
    lead.serviceTypes.set(serviceTypes);

    await this.entityManager.persist(lead).flush();
    return lead;
  }

  /**
   * Lists leads, with pagination, but currently no filtering or sorting.
   */
  async listLeads(listLeadsInput: ListLeadsInput) {
    const pageInfo = new PageInfo({
      itemsPerPage: listLeadsInput.itemsPerPage,
      currentPage: listLeadsInput.currentPage,
    });

    const [leads, totalCount] = await this.entityManager.findAndCount(
      Lead,
      {},
      {
        limit: listLeadsInput.itemsPerPage,
        offset: pageInfo.offset,
      },
    );

    pageInfo.totalItemsCount = totalCount;
    return new ListLeadsOutput(pageInfo, leads);
  }
}
