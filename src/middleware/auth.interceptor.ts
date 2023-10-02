import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Repository } from '../repository/repository.structure.js';
import { Auth } from '../services/auth.js';
import { HttpError } from '../types/error.js';

const debug = createDebug('TravelBook:Middleware:Auth.Interceptor');

export type WithId = {
  id: string;
  _id: string;
};
debug('Loaded');

export class AuthInterceptor {
  authorization(req: Request, _res: Response, next: NextFunction) {
    debug('Call authorization interceptor');
    try {
      const token = req.get('Authorization')?.split(' ')[1];
      if (!token) {
        throw new HttpError(498, 'Invalid token', 'No token provided');
      }

      const { id } = Auth.verifyJWTGettingPayload(token);
      req.body.validatedId = id;
      next();
    } catch (error) {
      next(error);
    }
  }

  authentication<T>(itemsRepo: Repository<T>, ownerKey: keyof T) {
    return async (req: Request, _res: Response, next: NextFunction) => {
      debug('Call authentication interceptor');
      const userID = req.body.validatedId;
      const itemID = req.params.id;
      debug(itemID);
      try {
        const item = await itemsRepo.getById(itemID);
        debug(ownerKey);
        const itemOwner = item[ownerKey] as WithId;

        if ((itemOwner._id as unknown as Buffer).toString('hex') !== userID) {
          throw new HttpError(403, 'Forbidden', 'Not item owner');
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
