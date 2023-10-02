import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Travel } from '../entities/travel.js';
import { TravelMongoRepository } from '../repository/travel.repository.js';
import { UsersMongoRepository } from '../repository/user.repository.js';
import { CloudinaryService } from '../services/media.files.js';
import { ImgData } from '../types/image.js';
import { AnyController } from './controller.structure.js';

const debug = createDebug('TravelBook:Controller:TravelController.js');
export class TravelController extends AnyController<Travel> {
  cloudinary: CloudinaryService;
  constructor(protected repo: TravelMongoRepository) {
    super(repo);
    this.cloudinary = new CloudinaryService();
    debug('Instantiated Travel controler');
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { validatedId } = req.body;
      const userRepo = new UsersMongoRepository();
      const user = await userRepo.getById(validatedId);
      req.body.traveler = user.id;
      const finaltravel = await this.repo.create(req.body);
      res.status(201);
      res.json(finaltravel);
    } catch (error) {
      next(error);
    }
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

  uploadMultiplePhotos(req: Request, res: Response, next: NextFunction) {
    type FilesReq = {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      destination: string;
      filename: string;
      path: string;
      size: number;
    };
    const photos: ImgData[] = [];
    try {
      (req.files! as FilesReq[]).forEach(async (file, index) => {
        const finalPath = file!.destination + '/' + file!.filename;
        const photo = await this.cloudinary.uploadImage(finalPath);
        photos.push(photo);
        if (index + 1 === req.files?.length) {
          res.status(201);
          res.json(photos);
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
