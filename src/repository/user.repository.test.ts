import { User } from '../entities/user.js';
import { UserModel } from './user.mongo.model.js';
import { UsersMongoRepository } from './user.repository.js';
jest.mock('./user.mongo.model.js');

describe('Given the class UsersMongoRepository', () => {
  let repo: UsersMongoRepository;
  beforeEach(() => {
    repo = new UsersMongoRepository();
  });

  describe('When we instantiate it and all is OK', () => {
    const mockExecGetAll = jest.fn().mockResolvedValueOnce([{ id: '1' }]);

    const mockExecGetbyId = jest.fn().mockResolvedValue({ id: '1' });

    const mockExecDelete = jest.fn().mockResolvedValue({});

    UserModel.find = jest.fn().mockReturnValueOnce({
      exec: mockExecGetAll,
    });

    UserModel.findById = jest.fn().mockReturnValueOnce({
      exec: mockExecGetAll,
    });

    UserModel.create = jest.fn().mockReturnValue({ userName: 'Miguel' });

    UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      userName: 'Miguel',
    });

    UserModel.findByIdAndDelete = jest.fn().mockReturnValue({
      exec: mockExecDelete,
    });

    test('We should use getAll', async () => {
      const result = await repo.getAll();
      expect(mockExecGetAll).toHaveBeenCalled();
      expect(result).toEqual([{ id: '1' }]);
    });

    test('We should use getById', async () => {
      UserModel.findById = jest.fn().mockReturnValueOnce({
        exec: mockExecGetbyId,
      });
      const mockData = { id: '1' };
      const result = await repo.getById(mockData.id);
      expect(mockExecGetbyId).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });

    test('We should use getById return []', async () => {
      UserModel.findById = jest.fn().mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(false),
      });

      expect(repo.getById('')).rejects.toThrow();
    });

    test('We should use create', async () => {
      const result = await repo.create({ userName: 'Miguel' } as User);
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toEqual({ userName: 'Miguel' } as User);
    });

    test('We should use update', async () => {
      const result = await repo.update('1', {});
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({ userName: 'Miguel' });
    });

    test('We should use delete', async () => {
      await repo.delete('1');
      expect(mockExecDelete).toHaveBeenCalled();
    });

    test('We should use find', async () => {
      UserModel.find = jest.fn().mockReturnValueOnce({
        exec: mockExecGetbyId,
      });
      await repo.find({ key: 'username', value: 'Miguel' });
      expect(UserModel.find).toHaveBeenCalled();
    });
  });

  describe('When we instantiate it and there are errors', () => {
    const mockExec = false;
    UserModel.findById = jest.fn().mockReturnValueOnce({
      exec: mockExec,
    });

    test('We should get an error if we use getById', () => {
      expect(repo.getById('')).rejects.toThrow();
    });
  });
});
