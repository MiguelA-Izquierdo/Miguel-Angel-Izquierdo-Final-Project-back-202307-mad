/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */
import { debug } from 'console';
import { NextFunction, Request, Response } from 'express';
import { Repository } from '../repository/repository.structure';

export interface Controller {
  getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
  getById(req: Request, res: Response, next: NextFunction): Promise<void>;
  create(req: Request, res: Response, next: NextFunction): Promise<void>;
  update(req: Request, res: Response, next: NextFunction): Promise<void>;
  delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export abstract class AnyController<T> implements Controller {
  constructor(protected repo: Repository<T>) {}
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.repo.getAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getAllFiltered(req: Request, res: Response, next: NextFunction) {
    try {
      const { key, value } = req.body;
      const data = await this.repo.find!({ key, value });
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await this.repo.getById(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const finalItem = await this.repo.create(req.body);
      res.status(201);
      res.json(finalItem);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      debug('estamos antes del repo', req.body);
      const finalItem = await this.repo.update(id, req.body);
      res.json(finalItem);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.repo.delete(id);
      res.status(204);
      res.json({});
    } catch (error) {
      next(error);
    }
  }
}
