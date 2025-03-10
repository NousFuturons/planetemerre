import express, { RequestHandler } from 'express';
import { Point } from '../models/Points';

const router = express.Router();

// Typages des corps des requêtes
interface CreatePointBody {
  name: string;
  description?: string;
  coordinates: [number, number];
  category: string;
}

// Créer un point
const createPoint: RequestHandler<{}, {}, CreatePointBody> = async (
  req, 
  res, 
  next
): Promise<void> => {
  try {
    const { name, description, coordinates, category } = req.body;

    if (!name || !coordinates || !category) {
      res.status(400).json({ error: 'Tous les champs requis ne sont pas remplis.' });
      return;
    }

    const point = new Point({ name, description, coordinates, category });
    const savedPoint = await point.save();
    res.status(201).json(savedPoint);
  } catch (error) {
    next(error);
  }
};

// Récupérer tous les points
const getPoints: RequestHandler = async (
  _req, 
  res, 
  next
): Promise<void> => {
  try {
    const points = await Point.find().populate('medias');
    res.status(200).json(points);
  } catch (error) {
    next(error);
  }
};

// Récupérer un point par ID
const getPointById: RequestHandler<{ id: string }> = async (
  req, 
  res, 
  next
): Promise<void> => {
  try {
    const { id } = req.params;
    const point = await Point.findById(id).populate('medias');

    if (!point) {
      res.status(404).json({ error: 'Point non trouvé.' });
      return; // Ajout du return pour éviter l'exécution du code suivant
    }

    res.status(200).json(point);
  } catch (error) {
    next(error);
  }
};

// Définition des routes
router.post('/', createPoint);
router.get('/', getPoints);
router.get('/:id', getPointById);

export default router;
