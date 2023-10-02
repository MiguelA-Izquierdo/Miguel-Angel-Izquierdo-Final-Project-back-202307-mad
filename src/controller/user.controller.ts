import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { LoginData, User } from '../entities/user.js';
import { UsersMongoRepository } from '../repository/user.repository.js';
import { Auth } from '../services/auth.js';
import { CloudinaryService } from '../services/media.files.js';
import { TokenPayload } from '../types/token.js';
import { AnyController } from './controller.structure.js';
const debug = createDebug('TravelBook:Controller:UsersController.js');
export class UsersController extends AnyController<User> {
  cloudinary: CloudinaryService;
  constructor(protected repo: UsersMongoRepository) {
    super(repo);
    this.cloudinary = new CloudinaryService();
    debug('Instantiated users controler');
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { userName, password } = req.body as unknown as LoginData;
    const error = new Error();

    try {
      if (!this.repo.find) return;
      const data = await this.repo.find({ key: 'userName', value: userName });
      if (!data.length) {
        throw error;
      }

      const user = data[0];
      debug(user.password);
      if (!(await Auth.compare(password, user.password))) {
        throw error;
      }

      const payload: TokenPayload = {
        id: user.id!,
        userName: user.userName,
      };
      const token = Auth.signJWT(payload);

      res.json({ user, token });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.password = await Auth.hash(req.body.password);
    } catch (error) {
      next(error);
      return;
    }

    super.create(req, res, next);
  }

  async uploadPhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const finalPath = req.file!.destination + '/' + req.file!.filename;
      const photo = await this.cloudinary.uploadImage(finalPath);

      res.status(201);
      res.json(photo);
    } catch (error) {
      next(error);
    }
  }
}
