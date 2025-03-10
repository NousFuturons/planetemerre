// src/routes/points.ts
import express, { Request, Response, NextFunction } from 'express';
import { Point } from '../models/Points';

const router = express.Router();

// Interface pour la requête de création de point
interface CreatePointRequest extends Request {
  body: {
    name: string;
    description: string;
    coordinates: [number, number];
    category: 'historical' | 'nature' | 'urban';
    medias?: string[];
  }
}

// GET tous les points
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const points = await Point.find().populate('medias');
    res.status(200).json(points);
  } catch (error) {
    next(error);
  }
});

// POST nouveau point
router.post('/', async (req: CreatePointRequest, res: Response, next: NextFunction) => {
  try {
    const point = new Point(req.body);
    const savedPoint = await point.save();
    res.status(201).json(savedPoint);
  } catch (error) {
    next(error);
  }
});

// GET point par ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const point = await Point.findById(req.params.id).populate('medias');
    if (!point) {
      res.status(404).json({ message: 'Point non trouvé' });
      return;
    }
    res.status(200).json(point);
  } catch (error) {
    next(error);
  }
});

// PUT mise à jour point
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const point = await Point.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!point) {
      res.status(404).json({ message: 'Point non trouvé' });
      return;
    }
    res.status(200).json(point);
  } catch (error) {
    next(error);
  }
});

// DELETE point
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const point = await Point.findByIdAndDelete(req.params.id);
    if (!point) {
      res.status(404).json({ message: 'Point non trouvé' });
      return;
    }
    res.status(200).json({ message: 'Point supprimé avec succès' });
  } catch (error) {
    next(error);
  }
});

export default router;
