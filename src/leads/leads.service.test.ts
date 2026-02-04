import { Test } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { createMock } from '@golevelup/ts-jest';
import { EntityManager } from '@mikro-orm/postgresql';
import { CreateLeadInput } from './models/create-lead.input';
import { ServiceType } from './models/service-type.entity';
import _ from 'lodash';
import { UnprocessableEntityException } from '@nestjs/common';
import { Lead } from './models/lead.entity';

describe('LeadsService', () => {
  let leadsService: LeadsService;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const mockModule = await Test.createTestingModule({
      providers: [LeadsService],
    })
      .useMocker(createMock)
      .compile();

    entityManager = mockModule.get(EntityManager);
    leadsService = mockModule.get(LeadsService);
  });

  describe('#createLead', () => {
    it('creates a new lead', async () => {
      // Arrange
      const leadDto: CreateLeadInput = {
        fullName: 'John Doe',
        email: 'john@doe.nut',
        mobileNumber: '+639201234567',
        postCode: '1234',
        serviceTypeNames: ['pick-up', 'delivery'],
      };

      jest
        .spyOn(entityManager, 'find')
        .mockResolvedValue([
          new ServiceType({ name: 'pick-up' }),
          new ServiceType({ name: 'delivery' }),
        ]);
      jest.spyOn(entityManager, 'persist').mockReturnThis();
      jest.spyOn(entityManager, 'flush').mockResolvedValue(undefined);

      // Act
      const result = await leadsService.createLead(leadDto);

      // Assert
      expect(entityManager.find).toHaveBeenCalledWith(ServiceType, {
        name: { $in: ['pick-up', 'delivery'] },
      });
      expect(entityManager.persist).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: leadDto.fullName,
          email: leadDto.email,
          mobileNumber: leadDto.mobileNumber,
          postCode: leadDto.postCode,
        }),
      );
      expect(entityManager.flush).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          fullName: leadDto.fullName,
          email: leadDto.email,
          mobileNumber: leadDto.mobileNumber,
          postCode: leadDto.postCode,
        }),
      );
    });

    it('handles duplicate service type names gracefully and efficiently', async () => {
      // Arrange
      const leadDto: CreateLeadInput = {
        fullName: 'Jane Doe',
        email: 'jane@doe.ph',
        mobileNumber: '+639198765432',
        postCode: '4321',
        serviceTypeNames: ['delivery', 'pick-up', 'delivery', 'pick-up'],
      };

      jest
        .spyOn(entityManager, 'find')
        .mockResolvedValue([
          new ServiceType({ name: 'pick-up' }),
          new ServiceType({ name: 'delivery' }),
        ]);
      jest.spyOn(entityManager, 'persist').mockReturnThis();
      jest.spyOn(entityManager, 'flush').mockResolvedValue(undefined);

      // Act
      const result = await leadsService.createLead(leadDto);

      // Assert
      expect(entityManager.find).toHaveBeenCalledWith(ServiceType, {
        name: { $in: ['delivery', 'pick-up'] },
      });
      expect(entityManager.persist).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: leadDto.fullName,
          email: leadDto.email,
          mobileNumber: leadDto.mobileNumber,
          postCode: leadDto.postCode,
        }),
      );
      expect(entityManager.flush).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          fullName: leadDto.fullName,
          email: leadDto.email,
          mobileNumber: leadDto.mobileNumber,
          postCode: leadDto.postCode,
        }),
      );
    });

    it('ignores non-existent service types without throwing an error', async () => {
      // Arrange
      const leadDto: CreateLeadInput = {
        fullName: 'Alice Smith',
        email: 'alice@smithsonian.gov.us',
        mobileNumber: '+639177654321',
        postCode: '5678',
        serviceTypeNames: ['non-existent-type', 'pick-up'],
      };

      jest.spyOn(entityManager, 'find').mockResolvedValue([new ServiceType({ name: 'pick-up' })]);
      jest.spyOn(entityManager, 'persist').mockReturnThis();
      jest.spyOn(entityManager, 'flush').mockResolvedValue(undefined);

      // Act
      const result = await leadsService.createLead(leadDto);

      // Assert
      expect(entityManager.find).toHaveBeenCalledWith(ServiceType, {
        name: { $in: ['non-existent-type', 'pick-up'] },
      });
      expect(entityManager.persist).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: leadDto.fullName,
          email: leadDto.email,
          mobileNumber: leadDto.mobileNumber,
          postCode: leadDto.postCode,
        }),
      );
      expect(entityManager.flush).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          fullName: leadDto.fullName,
          email: leadDto.email,
          mobileNumber: leadDto.mobileNumber,
          postCode: leadDto.postCode,
        }),
      );
    });

    it('refuses to create a lead if all service types are non-existent', async () => {
      // Arrange
      const leadDto: CreateLeadInput = {
        fullName: 'Bill Gates',
        email: 'bill@microslop.ai',
        mobileNumber: '+639166543210',
        postCode: '8765',
        serviceTypeNames: ['non-existent-type-1', 'non-existent-type-2'],
      };

      jest.spyOn(entityManager, 'find').mockResolvedValue([]);
      jest.spyOn(entityManager, 'persist').mockReturnThis();
      jest.spyOn(entityManager, 'flush').mockResolvedValue(undefined);

      // Act
      const result: unknown = await leadsService.createLead(leadDto).catch(_.identity);

      // Assert
      expect(entityManager.find).toHaveBeenCalledWith(ServiceType, {
        name: { $in: ['non-existent-type-1', 'non-existent-type-2'] },
      });
      expect(entityManager.persist).not.toHaveBeenCalled();
      expect(entityManager.flush).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(UnprocessableEntityException);
      expect(result as UnprocessableEntityException).toMatchObject({
        message: 'At least one valid service type must be provided.',
      });
    });
  });

  describe('#listLeads', () => {
    it('lists leads with pagination', async () => {
      // Arrange
      const listLeadsInput = {
        itemsPerPage: 2,
        currentPage: 1,
      };

      const mockLeadsPage = [
        new Lead({
          id: 1,
          fullName: 'Lead One',
          email: 'mike@lead.one',
          mobileNumber: '+639171234561',
          postCode: '1000',
        }),
        new Lead({
          id: 2,
          fullName: 'Lead Two',
          email: 'aragorn@two.towers',
          mobileNumber: '+639171234562',
          postCode: '2000',
        }),
      ];
      const mockTotalCount = 5;

      jest.spyOn(entityManager, 'findAndCount').mockResolvedValue([mockLeadsPage, mockTotalCount]);

      // Act
      const result = await leadsService.listLeads(listLeadsInput);

      // Assert
      expect(entityManager.findAndCount).toHaveBeenCalledWith(
        Lead,
        {},
        {
          limit: listLeadsInput.itemsPerPage,
          offset: 0,
        },
      );
      expect(result.pageInfo).toMatchObject({
        itemsPerPage: listLeadsInput.itemsPerPage,
        currentPage: listLeadsInput.currentPage,
        totalItemsCount: mockTotalCount,
      });
      expect(result.records).toEqual(mockLeadsPage);
    });
  });
});
