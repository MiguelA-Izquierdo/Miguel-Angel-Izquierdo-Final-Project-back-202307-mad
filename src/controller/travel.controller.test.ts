import { NextFunction, Request, Response } from 'express';
import { TravelMongoRepository } from '../repository/travel.repository';
import { UsersMongoRepository } from '../repository/user.repository';
import { CloudinaryService } from '../services/media.files';
import { TravelController } from './travel.controller';

jest.mock('../repository/user.repository');
UsersMongoRepository.prototype.getById = jest
  .fn()
  .mockResolvedValue({ id: '1' });
CloudinaryService.prototype.uploadImage = jest.fn();
describe('Given the travel controller', () => {
  const mockRepoTravel: TravelMongoRepository = {
    create: jest.fn().mockResolvedValue({ id: '1' }),
  } as unknown as TravelMongoRepository;

  const mockRequest = {
    body: {
      validateId: '1',
    },
    file: {
      filename: 'test-Name',
      destination: 'Destination test',
    } as unknown as File,
    files: [
      {
        destination: 'Destination test',
      } as unknown as File,
    ],
  } as unknown as Request;

  const mockResponse = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;
  const travelController = new TravelController(mockRepoTravel);

  describe('When we call the method create', () => {
    test('Should to be called mockrepo.create', async () => {
      await travelController.create(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('When we call the method uploadPhoto with a file in the request', () => {
    test('Should to be called mockresponse.json', async () => {
      await travelController.uploadPhoto(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('When we call the method uploadMultiplePhotos with a files in the request', () => {
    test('Should to be called mockresponss.json', () => {
      travelController.uploadMultiplePhotos(
        mockRequest,
        mockResponse,
        mockNext
      );
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('When we call the method uploadMultiplePhotos without a files in the request', () => {
    test('Should to be called mockresponss.json', () => {
      const mockRequest = {} as unknown as Request;
      travelController.uploadMultiplePhotos(
        mockRequest,
        mockResponse,
        mockNext
      );
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('When we call the method uploadPhoto without a file in the request', () => {
    test('Should to be called mockresponss.json', () => {
      const mockRequest = {} as unknown as Request;
      travelController.uploadPhoto(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('When we call the method getAllFiltered', () => {
    test('should call getAllFilterd and return data', async () => {
      const mockRequest = {
        body: { key: 'test', value: 'test-value' },
      } as unknown as Request;

      travelController.getAllFiltered(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('When we call the method getAllFiltered whitout data body', () => {
    test('should call getAllFilterd and return error', async () => {
      const mockRequest = {} as unknown as Request;
      travelController.getAllFiltered(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });
});
