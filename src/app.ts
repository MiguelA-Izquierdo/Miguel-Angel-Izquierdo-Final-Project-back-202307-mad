import cors from 'cors';
import createDebug from 'debug';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { TravelController } from './controller/travel.controller.js';
import { UsersController } from './controller/user.controller.js';
import { ErrorMiddleware } from './middleware/error.middleware.js';
import { FilesInterceptor } from './middleware/files.interceptor.js';
import { TravelMongoRepository } from './repository/travel.repository.js';
import { UsersMongoRepository } from './repository/user.repository.js';
import { TripsRouter } from './router/trips.router.js';
import { UsersRouter } from './router/users.router.js';
import { HttpError } from './types/error.js';

const debug = createDebug('TravelBook:App');
export const app = express();

debug('Started');

app.use(morgan('dev'));
app.use(cors());

app.use(express.json());
app.use(express.static('public'));

const filesInterceptor = new FilesInterceptor();
const userRepo: UsersMongoRepository = new UsersMongoRepository();
const userController: UsersController = new UsersController(userRepo);
const userRouter = new UsersRouter(userController, filesInterceptor);
app.use('/users', userRouter.router);

const travelRepo: TravelMongoRepository = new TravelMongoRepository();
const travelController: TravelController = new TravelController(travelRepo);
const travelRouter = new TripsRouter(travelController, filesInterceptor);
app.use('/trips', travelRouter.router);

app.use('/:any', (req: Request, res: Response, next: NextFunction) => {
  const error = new HttpError(400, 'Bad request', 'Invalid route');
  next(error);
});
const errorMiddleware = new ErrorMiddleware();
app.use(errorMiddleware.manageErrors.bind(errorMiddleware));
