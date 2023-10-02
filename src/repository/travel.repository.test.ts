import { Travel } from '../entities/travel.js';
import { TravelModel } from './travel.mongo.model.js';
import { TravelMongoRepository } from './travel.repository.js';
jest.mock('./travel.mongo.model.js');

describe('Given the class TravelsMongoRepository', () => {
  let repo: TravelMongoRepository;
  beforeEach(() => {
    repo = new TravelMongoRepository();
  });

  describe('When we instantiate it and all is OK', () => {
    const mockExecGetAll = jest.fn().mockResolvedValueOnce([{ id: '1' }]);

    const mockExecGetbyId = jest.fn().mockResolvedValueOnce({ id: '1' });

    const mockExecDelete = jest.fn().mockResolvedValue({});

    TravelModel.find = jest.fn().mockReturnValueOnce({
      populate: jest.fn().mockReturnValue({
        exec: mockExecGetAll,
      }),
    });

    TravelModel.findById = jest.fn().mockReturnValueOnce({
      populate: jest.fn().mockReturnValue({
        exec: mockExecGetbyId,
      }),
    });

    TravelModel.create = jest.fn().mockReturnValueOnce({
      populate: jest.fn().mockReturnValue({
        exec: {
          city: 'Test-City',
        },
      }),
    });
    TravelModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      city: 'Test-City',
    });

    TravelModel.findByIdAndDelete = jest.fn().mockReturnValue({
      exec: mockExecDelete,
    });

    test('We should use getAll', async () => {
      const result = await repo.getAll();
      expect(mockExecGetAll).toHaveBeenCalled();
      expect(result).toEqual([{ id: '1' }]);
    });

    test('We should use getById', async () => {
      TravelModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          exec: mockExecGetbyId,
        }),
      });
      const mockData = { id: '1' };
      const result = await repo.getById(mockData.id);
      expect(mockExecGetbyId).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });

    test('We should use getById return []', async () => {
      expect(repo.getById('')).rejects.toThrow();
    });

    test('We should use create', async () => {
      TravelModel.create = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          city: 'Test-City',
        }),
      });
      const result = await repo.create({ city: 'Test-City' } as Travel);
      expect(TravelModel.create).toHaveBeenCalled();
      expect(result).toEqual({ city: 'Test-City' } as Travel);
    });

    test('We should use update', async () => {
      const result = await repo.update('1', {});
      expect(TravelModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({ city: 'Test-City' });
    });

    test('We should use delete', async () => {
      await repo.delete('1');
      expect(mockExecDelete).toHaveBeenCalled();
    });

    test('We should use find', async () => {
      TravelModel.find = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          exec: mockExecGetbyId,
        }),
      });
      await repo.find({ key: 'city', value: 'Test-City' });
      expect(TravelModel.find).toHaveBeenCalled();
    });
  });

  describe('When we instantiate it and there are errors', () => {
    TravelModel.findById = jest.fn().mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce({
        exec: jest.fn().mockResolvedValueOnce(false),
      }),
    });

    test('We should get an error if we use getById', () => {
      expect(repo.getById('')).rejects.toThrow();
    });
  });
});
