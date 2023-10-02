import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { HttpError } from '../types/error.js';
const debug = createDebug('TravelBook:Middleware:Error');

export class ErrorMiddleware {
  constructor() {
    debug('Instantiated');
  }

  manageErrors(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    debug('Error', error.message);

    let type = 'Server Error';
    res.status(500);
    res.statusMessage = 'Internal Server Error';

    if (error instanceof HttpError) {
      res.status(error.status);
      res.statusMessage = error.statusMessage;
      type = 'Http Error';
    } else if (error instanceof mongoose.Error.ValidationError) {
      res.status(400);
      res.statusMessage = 'Bad Request';
      type = 'Validation Error';
    } else if (error instanceof mongoose.Error.CastError) {
      res.status(400);
      res.statusMessage = 'Bad Request';
      type = 'Casting Error';
    } else if (error instanceof mongoose.mongo.MongoServerError) {
      res.status(406);
      res.statusMessage = 'Not accepted';
      type = 'Non unique Error';
    }

    res.json({
      type,
      status: res.statusCode,
      statusMessage: res.statusMessage,
      message: error.message,
      errorName: error.name,
    });
  }
}
