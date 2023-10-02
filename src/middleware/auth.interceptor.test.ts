import { Buffer } from 'buffer';
import { Request, Response } from 'express';
import { User } from '../entities/user';
import { Repository } from '../repository/repository.structure.js';
import { Auth } from '../services/auth.js';
import { HttpError } from '../types/error.js';
import { AuthInterceptor } from './auth.interceptor';
jest.mock('../services/auth.js');
jest.mock('buffer');

describe('Given AuthInterceptor and instantiate it', () => {
  const interceptor = new AuthInterceptor();
  const mockResponse = {} as Response;
  const mockNext = jest.fn();
  describe('When authorization is used ', () => {
    test('it should be called without errors', () => {
      const mockRequest = {
        get: jest.fn().mockReturnValue('Bearer soy_el_token'),
        body: {},
      } as unknown as Request;

      Auth.verifyJWTGettingPayload = jest.fn().mockReturnValue({
        id: '1',
      });

      interceptor.authorization(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith();
    });
    test('it should be called with errors', () => {
      const mockRequest = {
        get: jest.fn().mockReturnValue(''),
        body: {},
      } as unknown as Request;

      const mockError = new HttpError(
        498,
        'Invalid token',
        'No token provided'
      );

      Auth.verifyJWTGettingPayload = jest.fn().mockReturnValue({
        id: '1',
      });

      interceptor.authorization(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('When authentication is used', () => {
    type Item = {
      id: string;
      owner: User;
    };
    const repo = {
      getById: jest.fn().mockResolvedValue({
        owner: { id: 12 },
      }),
    } as unknown as Repository<Item>;

    const authenticationMiddleware = interceptor.authentication<Item>(
      repo,
      'owner'
    );

    test('middleware should be called without error', async () => {
      Buffer.toString = jest.fn().mockReturnValue('12');
      const repo = {
        getById: jest
          .fn()
          .mockRejectedValue(new HttpError(403, 'Forbidden', 'Not item owner')),
      } as unknown as Repository<Item>;
      const mockRequest = {
        params: {},
        body: {
          validatedId: 12,
        },
      } as Request;
      const authenticationMiddleware = interceptor.authentication<Item>(
        repo,
        'owner'
      );
      await authenticationMiddleware(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith();
    });

    test('middleware should be called WITH error', async () => {
      const mockRequest = {
        params: {},
        body: {
          validatedId: 10,
        },
      } as Request;

      await authenticationMiddleware(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 403,
        })
      );
    });
  });
});
