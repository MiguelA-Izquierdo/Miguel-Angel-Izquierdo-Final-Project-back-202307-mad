import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user.js';
import { UsersMongoRepository } from '../repository/user.repository.js';
import { Auth } from '../services/auth.js';
import { CloudinaryService } from '../services/media.files.js';
import { UsersController } from './user.controller.js';

CloudinaryService.prototype.uploadImage = jest.fn();
describe('Given the module UserssControler', () => {
  Auth.compare = jest.fn().mockResolvedValueOnce(Promise<true>);
  Auth.signJWT = jest.fn().mockResolvedValueOnce('');
  const mockRepo: UsersMongoRepository = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  };

  const mockResponse = {
    status: jest.fn(),
    json: {},
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;
  const usersController = new UsersController(mockRepo);
  describe('when we execute its methods and we have a successful answer', () => {
    (mockRepo.find as jest.Mock).mockResolvedValueOnce([
      { userName: 'Miguel', password: '12345', id: '1' },
    ]);

    const mockRequest = {
      body: { userName: 'Miguel', password: '12345' },
      params: { userName: 'Miguel', password: '12345' },
      file: {
        destination: '',
        filename: '',
      },
    } as unknown as Request;

    test('should call login and return data', async () => {
      await usersController.login(mockRequest, mockResponse, mockNext);
      expect(mockRepo.find).toBeCalledWith({
        key: 'userName',
        value: 'Miguel',
      });
    });

    test('should call create and return data', async () => {
      await usersController.create(mockRequest, mockResponse, mockNext);
      expect(mockRepo.create).toBeCalled();
    });

    test('should call udpate and return data', async () => {
      (mockRepo.update as jest.Mock).mockResolvedValueOnce([
        { userName: 'Miguel', password: '12345' },
      ]);
      await usersController.update(mockRequest, mockResponse, mockNext);
      expect(mockRepo.update).toBeCalled();
    });

    test('should call delete and return data', async () => {
      await usersController.delete(mockRequest, mockResponse, mockNext);
      expect(mockRepo.delete).toBeCalled();
    });

    test('should call getAll and return data', async () => {
      (mockRepo.getAll as jest.Mock).mockResolvedValueOnce([
        { userName: 'Miguel', password: '12345' },
      ]);
      await usersController.getAll(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getAll).toBeCalled();
    });

    test('should call getById and return data', async () => {
      await usersController.getById(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getById).toBeCalled();
    });

    test('should call uploadPhoto and return data', async () => {
      const mockResponse = {
        status: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;
      await usersController.uploadPhoto(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toBeCalled();
    });
  });

  describe('when we execute its methods and we have a error answer', () => {
    const mockResponse = {
      json: jest.fn(),
    } as unknown as Response;

    const mockNext = jest.fn();
    const usersControler = new UsersController(mockRepo);

    test('should call login with userName error and return error', async () => {
      const mockRequest = {
        body: { username: 'Migue', password: '12345' },
      } as Request;

      (mockRepo.find as jest.Mock).mockResolvedValueOnce([
        {} as unknown as User,
      ]);
      await usersControler.login(mockRequest, mockResponse, mockNext);
      expect(mockRepo.find).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
      (mockRepo.find as jest.Mock).mockResolvedValueOnce([]);
      await usersControler.login(mockRequest, mockResponse, mockNext);
    });

    test('should call login with password error and return error', async () => {
      const mockRequest = {
        body: { username: 'Miguel', password: '12345' },
      } as Request;

      (mockRepo.find as jest.Mock).mockResolvedValueOnce([
        {
          userName: 'Miguel',
          password: '1234',
        } as unknown as Promise<User>,
      ]);

      await usersControler.login(mockRequest, mockResponse, mockNext);
      expect(mockRepo.find).toHaveBeenCalled();
      (mockRepo.find as jest.Mock).mockRejectedValueOnce(
        new Error('GetAll Error')
      );
      expect(mockNext).toHaveBeenCalled();
    });

    test('should call create with password error and return error', async () => {
      const mockRequest = {
        body: { username: 'Miguel', password: '12345' },
      } as Request;

      (mockRepo.create as jest.Mock).mockRejectedValueOnce(new Error());

      await usersControler.create(mockRequest, mockResponse, mockNext);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
