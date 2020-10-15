import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/upload';
import OrphanageCtrl from './controllers/OrphanagesCtrl';

const routes = Router();
const upload = multer(uploadConfig);

routes
  .get('/orphanages', OrphanageCtrl.index)
  .get('/orphanages/:id', OrphanageCtrl.show)
  .post('/orphanages', upload.array('images'), OrphanageCtrl.create);

export default routes;
