import { TravelController } from '../controller/travel.controller';
import { FilesInterceptor } from '../middleware/files.interceptor';
import { TripsRouter } from './trips.router';

describe('Given TripsRouter', () => {
  describe('When we instantiate it', () => {
    jest.spyOn(Function.prototype, 'bind');
    const controller = {
      uploadPhoto: jest.fn(),
      uploadMultiplePhotos: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getAllFiltered: jest.fn(),
    } as unknown as TravelController;

    FilesInterceptor.prototype.singleFileStore = jest
      .fn()
      .mockReturnValue(() => {});

    FilesInterceptor.prototype.multipleFileStore = jest
      .fn()
      .mockReturnValue(() => {});

    const mockFileInterceptor = new FilesInterceptor();
    const router = new TripsRouter(controller, mockFileInterceptor);
    test('Then router should to be instance of TripsRouter and bind function shold be called 15 times', () => {
      expect(router).toBeInstanceOf(TripsRouter);
      expect(Function.prototype.bind).toHaveBeenCalledTimes(15);
    });
  });
});
