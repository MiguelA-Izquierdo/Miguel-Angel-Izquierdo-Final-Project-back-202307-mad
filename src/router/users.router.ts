/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import express, { Router as createRouter } from 'express';
import { UsersController } from '../controller/user.controller.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FilesInterceptor } from '../middleware/files.interceptor.js';
import { UsersMongoRepository } from '../repository/user.repository.js';

const debug = createDebug('TravelBook:Router:UsersRouter');

export class UsersRouter {
  router: express.Router;
  authInterceptor: AuthInterceptor;
  repoUser: UsersMongoRepository;

  constructor(
    private controller: UsersController,
    private filesInterceptor: FilesInterceptor
  ) {
    debug('Instantiated');
    this.router = createRouter();
    this.authInterceptor = new AuthInterceptor();
    this.repoUser = new UsersMongoRepository();
    this.configure();
  }

  configure() {
    this.router.patch('/login', this.controller.login.bind(this.controller));

    this.router.post('/register', this.controller.create.bind(this.controller));

    this.router.post(
      '/uploadphoto',
      this.filesInterceptor.singleFileStore('mainPhoto'),
      this.controller.uploadPhoto.bind(this.controller)
    );

    this.router.get('/', this.controller.getAll.bind(this.controller));
    this.router.get('/:id', this.controller.getById.bind(this.controller));
    this.router.patch(
      '/:id',
      this.authInterceptor.authorization.bind(this.authInterceptor),
      this.authInterceptor.authentication(this.repoUser, 'id'),
      this.controller.update.bind(this.controller)
    );
    this.router.delete('/:id', this.controller.delete.bind(this.controller));
  }
}
