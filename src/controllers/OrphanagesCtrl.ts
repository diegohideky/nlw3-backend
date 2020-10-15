import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';
import Orphanage from '../models/Orphanage';
import orphanagesView from '../views/orphanages.view';

export default {
  async index(req: Request, res: Response): Promise<Response> {
    const orphanagesRepo = getRepository(Orphanage);

    const orphanages = await orphanagesRepo.find({
      relations: ['images']
    });

    return res.json(orphanages);
  },

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const orphanagesRepo = getRepository(Orphanage);

    const orphanage = await orphanagesRepo.findOneOrFail(id, {
      relations: ['images']
    });

    return res.json(orphanagesView.render(orphanage));
  },

  async create(req: Request, res: Response): Promise<Response> {
    const orphanagesRepo = getRepository(Orphanage);

    const requestImages = req.files as Express.Multer.File[];
    const images = requestImages.map((image) => ({ path: image.filename }));

    const data = { ...req.body, images };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required()
        })
      )
    });

    await schema.validate(data, { abortEarly: false });

    const orphanage = orphanagesRepo.create(data);

    await orphanagesRepo.save(orphanage);

    return res.status(201).json(orphanage);
  }
}
