import { Test } from '@nestjs/testing';
import { LeadsService } from '../leads.service';
import { LeadsResolver } from './leads.resolver';
import { createMock } from '@golevelup/ts-jest';
import { Lead } from './lead.entity';

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
});
