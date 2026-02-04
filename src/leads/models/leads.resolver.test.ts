import { Test } from '@nestjs/testing';
import { LeadsService } from '../leads.service';
import { LeadsResolver } from './leads.resolver';
import { createMock } from '@golevelup/ts-jest';
import { Lead } from './lead.entity';
import { ListLeadsOutput } from './list-leads-output.model';
import { PageInfo } from '../../common/models/page-info.model';
import { ListLeadsInput } from './list-leads.input';

describe('LeadsResolver', () => {
  let leadsResolver: LeadsResolver;
  let leadsService: LeadsService;

  beforeEach(async () => {
    const mockModule = await Test.createTestingModule({
      providers: [LeadsResolver, LeadsService],
    })
      .useMocker(createMock)
      .compile();

    leadsResolver = mockModule.get(LeadsResolver);
    leadsService = mockModule.get(LeadsService);
  });

  describe('#createLead', () => {
    it('calls LeadsService.createLead with correct parameters', async () => {
      // Arrange
      const newLeadData = {
        fullName: 'Jane Doe',
        email: 'jane@foo.bar',
        mobileNumber: '+639171234567',
        postCode: '5678',
        serviceTypeNames: ['pick-up'],
      };

      const expectedLead = new Lead({ id: 1, ...newLeadData });
      jest.spyOn(leadsService, 'createLead').mockResolvedValue(expectedLead);

      // Act
      const result = await leadsResolver.createLead(newLeadData);

      // Assert
      expect(leadsService.createLead).toHaveBeenCalledWith(newLeadData);
      expect(result).toBe(expectedLead);
    });
  });

  describe('#listLeads', () => {
    it('calls LeadsService.listLeads with correct parameters', async () => {
      // Arrange
      const listLeadsInput = new ListLeadsInput({ itemsPerPage: 10, currentPage: 1 });

      const expectedLeads = [
        new Lead({
          id: 1,
          fullName: 'Lead One',
          email: 'one@doe.net',
          mobileNumber: '+639181234567',
          postCode: '1111',
        }),
        new Lead({
          id: 2,
          fullName: 'Lead Two',
          email: 'two@doe.net',
          mobileNumber: '+639191234567',
          postCode: '2222',
        }),
      ];
      jest
        .spyOn(leadsService, 'listLeads')
        .mockResolvedValue(
          new ListLeadsOutput(
            new PageInfo({ itemsPerPage: 10, currentPage: 1, totalItemsCount: 2 }),
            expectedLeads,
          ),
        );

      // Act
      const result = await leadsResolver.listLeads(listLeadsInput);

      // Assert
      expect(leadsService.listLeads).toHaveBeenCalledWith(listLeadsInput);
      expect(result).toEqual(
        new ListLeadsOutput(
          new PageInfo({ itemsPerPage: 10, currentPage: 1, totalItemsCount: 2 }),
          expectedLeads,
        ),
      );
    });
  });

  describe('#getLeadById', () => {
    it('calls LeadsService.getLeadById with correct parameters', async () => {
      // Arrange
      const leadId = 5;
      const expectedLead = new Lead({
        id: leadId,
        fullName: 'Specific Lead',
        email: 'specific@lead.ph',
        mobileNumber: '+639171234568',
        postCode: '5555',
      });
      jest.spyOn(leadsService, 'getLeadById').mockResolvedValue(expectedLead);

      // Act
      const result = await leadsResolver.getLeadById(leadId);

      // Assert
      expect(leadsService.getLeadById).toHaveBeenCalledWith(leadId);
      expect(result).toBe(expectedLead);
    });
  });
});
