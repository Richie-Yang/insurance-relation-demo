import { describe, it, beforeEach, jest, expect } from '@jest/globals';
import { policyHoldersRepository } from '../../repositories/policy-holders.repository';
import * as policyHoldersService from '../../services/policy-holders.service';

jest.mock('../../repositories/policy-holders.repository', () => ({
  policyHoldersRepository: {
    findOne: jest.fn(),
    find: jest.fn(),
    directCreate: jest.fn(),
  },
}));

describe('policyHoldersService', () => {
  const mockedPolicyHoldersRepository =
    policyHoldersRepository as jest.Mocked<any>;

  const mockedHolders = [
    {
      code: '1',
      name: 'test',
      registration_date: new Date(),
      introducer_code: null,
    },
    {
      code: '2',
      name: 'test',
      registration_date: new Date(),
      introducer_code: '1',
    },
    {
      code: '3',
      name: 'test',
      registration_date: new Date(),
      introducer_code: '1',
    },
    {
      code: '4',
      name: 'test',
      registration_date: new Date(),
      introducer_code: '2',
    },
    {
      code: '5',
      name: 'test',
      registration_date: new Date(),
      introducer_code: '2',
    },
    {
      code: '6',
      name: 'test',
      registration_date: new Date(),
      introducer_code: '3',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getParentHolder', () => {
    it('should throw an error if policy holder not found', async () => {
      mockedPolicyHoldersRepository.findOne.mockResolvedValue(null);

      await expect(
        policyHoldersService.getParentHolder('123')
      ).rejects.toThrow();
    });
  });

  describe('getChildHolders', () => {
    it('should throw an error if policy holder not found', async () => {
      mockedPolicyHoldersRepository.findOne.mockResolvedValue(null);

      await expect(
        policyHoldersService.getChildHolders('123')
      ).rejects.toThrow();
    });

    it('should return child holders if policy holder found', async () => {
      const expectedResult = {
        ...mockedHolders[0],
        l: [mockedHolders[1]],
        r: [mockedHolders[2]],
      };
      mockedPolicyHoldersRepository.findOne.mockResolvedValue(mockedHolders[0]);
      mockedPolicyHoldersRepository.find
        .mockResolvedValueOnce([mockedHolders[1], mockedHolders[2]])
        .mockResolvedValue([]);

      await expect(
        policyHoldersService.getChildHolders('test')
      ).resolves.toEqual(expectedResult);
    });
  });
});
