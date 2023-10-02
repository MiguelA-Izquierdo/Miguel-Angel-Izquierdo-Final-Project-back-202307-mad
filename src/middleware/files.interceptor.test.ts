/* eslint-disable max-nested-callbacks */
import { Request, Response } from 'express';
import multer from 'multer';
import { FilesInterceptor } from './files.interceptor';

jest.mock('multer');

describe('Given FilesInterceptor class', () => {
  describe('When we instantiate it', () => {
    const filesInterceptor = new FilesInterceptor();
    describe('When we call the method singleFileStore', () => {
      test('Then mockMiddleware should and call', () => {
        const mockMiddleware = jest.fn();
        multer.diskStorage = jest
          .fn()
          .mockImplementation(({ filename }) => filename('', '', () => {}));
        (multer as unknown as jest.Mock).mockReturnValue({
          single: jest.fn().mockReturnValue(mockMiddleware),
        });

        const mockResponse = {} as Response;
        const mockRequest = {} as Request;
        const mockNext = jest.fn();

        filesInterceptor.singleFileStore('')(
          mockRequest,
          mockResponse,
          mockNext
        );
        expect(mockMiddleware).toHaveBeenCalled();
      });
    });

    describe('When we call the method multipleFileStore', () => {
      test('Then mockMiddleware should and call', () => {
        const mockMiddleware = jest.fn();
        multer.diskStorage = jest
          .fn()
          .mockImplementation(({ filename }) => filename('', '', () => {}));
        (multer as unknown as jest.Mock).mockReturnValue({
          array: jest.fn().mockReturnValue(mockMiddleware),
        });

        const mockResponse = {} as Response;
        const mockRequest = {} as Request;
        const mockNext = jest.fn();

        filesInterceptor.multipleFileStore('')(
          mockRequest,
          mockResponse,
          mockNext
        );
        expect(mockMiddleware).toHaveBeenCalled();
      });
    });
  });
});
