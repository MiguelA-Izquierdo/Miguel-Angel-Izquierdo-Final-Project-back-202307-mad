/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import express, { Router as createRouter } from 'express';
import { TravelController } from '../controller/travel.controller';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FilesInterceptor } from '../middleware/files.interceptor.js';
import { TravelMongoRepository } from '../repository/travel.repository.js';

const debug = createDebug('TravelBook:Router:TripsRouter');

export class TripsRouter {
  router: express.Router;
  authInterceptor: AuthInterceptor;
  repoTravel: TravelMongoRepository;

  constructor(
    private controller: TravelController,
    private filesInterceptor: FilesInterceptor
  ) {
    debug('Instantiated');
    this.router = createRouter();
    this.authInterceptor = new AuthInterceptor();
    this.repoTravel = new TravelMongoRepository();
    this.configure();
  }

  configure() {
    this.router.get('/', this.controller.getAll.bind(this.controller));
    this.router.get('/:id', this.controller.getById.bind(this.controller));

    this.router.post(
      '/filter',
      this.authInterceptor.authorization.bind(this.authInterceptor),
      this.controller.getAllFiltered.bind(this.controller)
    );

    this.router.post(
      '/uploadphoto',
      this.filesInterceptor.singleFileStore('mainPhoto'),
      this.controller.uploadPhoto.bind(this.controller)
    );

    this.router.post(
      '/uploadphotos',
      this.authInterceptor.authorization.bind(this.authInterceptor),
      this.filesInterceptor.multipleFileStore('photos'),
      this.controller.uploadMultiplePhotos.bind(this.controller)
    );

    this.router.post(
      '/',
      this.authInterceptor.authorization.bind(this.authInterceptor),
      this.controller.create.bind(this.controller)
    );

    this.router.patch(
      '/:id',
      this.authInterceptor.authorization.bind(this.authInterceptor),
      this.authInterceptor
        .authentication(this.repoTravel, 'traveler')
        .bind(this.authInterceptor),
      this.controller.update.bind(this.controller)
    );

    this.router.delete(
      '/:id',
      this.authInterceptor.authorization.bind(this.authInterceptor),
      this.authInterceptor
        .authentication(this.repoTravel, 'traveler')
        .bind(this.authInterceptor),
      this.controller.delete.bind(this.controller)
    );
  }
}
