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
  const mockedPolicyHoldersService = policyHoldersService as jest.Mocked<any>;
  const mockedPolicyHoldersRepository =
    policyHoldersRepository as jest.Mocked<any>;

  const mockedHolders = [
    {
      id: 1,
      code: '1',
      name: 'test',
      registration_date: new Date(),
      introducer_code: null,
    },
    {
      id: 2,
      code: '2',
      name: 'test',
      registration_date: new Date(),
      introducer_code: '1',
    },
    {
      id: 3,
      code: '3',
      name: 'test',
      registration_date: new Date(),
      introducer_code: '1',
    },
    {
      id: 4,
      code: '4',
      name: 'test',
      registration_date: new Date(),
      introducer_code: '2',
    },
    {
      id: 5,
      code: '5',
      name: 'test',
      registration_date: new Date(),
      introducer_code: '2',
    },
    {
      id: 6,
      code: '6',
      name: 'test',
      registration_date: new Date(),
      introducer_code: '3',
    },
    {
      id: 7,
      code: '7',
      name: 'test',
      registration_date: new Date(),
      introducer_code: '3',
    },
    {
      id: 8,
      code: '8',
      name: 'test',
      registration_date: new Date(),
      introducer_code: '4',
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
        l: [mockedHolders[1], mockedHolders[3], mockedHolders[4]],
        r: [mockedHolders[2], mockedHolders[5]],
      };
      mockedPolicyHoldersRepository.findOne.mockResolvedValue(mockedHolders[0]);
      mockedPolicyHoldersRepository.find.mockResolvedValue([
        mockedHolders[1],
        mockedHolders[2],
      ]);

      const spy = jest.spyOn(
        mockedPolicyHoldersService,
        'nodeBreathFirstSearch'
      );
      spy.mockResolvedValueOnce([mockedHolders[3], mockedHolders[4]]);
      spy.mockResolvedValueOnce([mockedHolders[5]]);

      await expect(
        policyHoldersService.getChildHolders('test')
      ).resolves.toEqual(expectedResult);

      spy.mockRestore();
    });
  });

  describe('nodeBreathFirstSearch', () => {
    function setupHolderRepoCall() {
      mockedPolicyHoldersRepository.find.mockRestore();
      mockedPolicyHoldersRepository.find
        .mockResolvedValueOnce([mockedHolders[1], mockedHolders[2]])
        .mockResolvedValueOnce([mockedHolders[3], mockedHolders[4]])
        .mockResolvedValueOnce([mockedHolders[5], mockedHolders[6]])
        .mockResolvedValueOnce([mockedHolders[7]])
        .mockResolvedValue([]);
    }

    it('success with only 2 levels', async () => {
      const currentLevel = 0;
      const maxLevel = 1;
      const node = mockedHolders[0];
      const expectedResult = [mockedHolders[1], mockedHolders[2]];

      setupHolderRepoCall();

      const result = await policyHoldersService.nodeBreathFirstSearch(
        node,
        currentLevel,
        maxLevel
      );
      expect(result).toEqual(expectedResult);
    });

    it('success with only 3 levels', async () => {
      const currentLevel = 0;
      const maxLevel = 2;
      const node = mockedHolders[0];
      const expectedResult = [
        mockedHolders[1],
        mockedHolders[2],
        mockedHolders[3],
        mockedHolders[4],
        mockedHolders[5],
        mockedHolders[6],
      ];

      setupHolderRepoCall();

      const result = await policyHoldersService.nodeBreathFirstSearch(
        node,
        currentLevel,
        maxLevel
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
