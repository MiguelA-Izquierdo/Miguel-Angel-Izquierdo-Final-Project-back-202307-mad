import { UsersController } from '../controller/user.controller';
import { FilesInterceptor } from '../middleware/files.interceptor';
import { UsersRouter } from './users.router';

describe('Given UsersRouter', () => {
  describe('When we instantiate it', () => {
    jest.spyOn(Function.prototype, 'bind');
    const controller = {
      getAll: jest.fn(),
      getById: jest.fn(),
      login: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      uploadPhoto: jest.fn(),
    } as unknown as UsersController;

    FilesInterceptor.prototype.singleFileStore = jest
      .fn()
      .mockReturnValue(() => {});

    const mockFileInterceptor = new FilesInterceptor();
    const router = new UsersRouter(controller, mockFileInterceptor);
    test('Then router should to be instance of UserRouter and bind function shold be called 8', () => {
      expect(router).toBeInstanceOf(UsersRouter);
      expect(Function.prototype.bind).toHaveBeenCalledTimes(8);
    });
  });
});
