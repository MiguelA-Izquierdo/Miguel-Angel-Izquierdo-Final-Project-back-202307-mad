import { Request, Response } from 'express';
import { ErrorDescription } from 'mongodb';
import mongoose from 'mongoose';
import { HttpError } from '../types/error';
import { ErrorMiddleware } from './error.middleware';

describe('Given ErrorMiddleware class', () => {
  describe('When we instantiate it', () => {
    const errorMiddleware = new ErrorMiddleware();
    const mockRequest = {} as Request;
    const mockResponse = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;
    const mockNext = jest.fn();
    test('Then manageError should be used with Error', () => {
      const error = new Error('Test Error');
      errorMiddleware.manageErrors(error, mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'Server Error',
        })
      );
    });

    test('Then manageError should be used with HttpError', () => {
      const error = new HttpError(400, 'Bad Request', 'Test HttpError');
      errorMiddleware.manageErrors(error, mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'Http Error',
        })
      );
    });

    test('Then manageError should be used with ValidationError', () => {
      const error = new mongoose.Error.ValidationError();
      errorMiddleware.manageErrors(error, mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'Validation Error',
        })
      );
    });

    test('Then manageError should be used with CastError', () => {
      const error = new mongoose.Error.CastError('Cast Error', 404, '');
      errorMiddleware.manageErrors(error, mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
    test('Then manageError should be used with Not accepted', () => {
      const error = new mongoose.mongo.MongoServerError(
        '' as unknown as ErrorDescription
      );
      errorMiddleware.manageErrors(error, mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'Non unique Error',
        })
      );
    });
  });
});
