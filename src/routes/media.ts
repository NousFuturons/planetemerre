import express, { RequestHandler } from 'express';
import { Media, MediaType } from '../models/Media';
import { Point } from '../models/Points';

const router = express.Router();

// Interfaces pour le typage des requêtes
interface CreateMediaBody {
  title: string;
  type: MediaType;
  content: string;
  pointId: string;
  metadata: {
    image?: {
      width: number;
      height: number;
      format: string;
      size: number;
      alt?: string;
    };
    video?: {
      duration: number;
      format: string;
      size: number;
      thumbnail?: string;
    };
    audio?: {
      duration: number;
      format: string;
      size: number;
    };
    text?: {
      wordCount: number;
      language: string;
      format: 'plain' | 'markdown' | 'rich';
    };
    html?: {
      version: string;
      scripts: boolean;
      styles: boolean;
    };
  };
}

// Créer un média
const createMedia: RequestHandler<{}, {}, CreateMediaBody> = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { title, type, content, pointId, metadata } = req.body;

    if (!title || !type || !content || !pointId) {
      res.status(400).json({ error: 'Tous les champs requis ne sont pas remplis.' });
      return;
    }

    const point = await Point.findById(pointId);
    if (!point) {
      res.status(404).json({ error: 'Point non trouvé.' });
      return;
    }

    const media = new Media({ title, type, content, pointId, metadata });
    const savedMedia = await media.save();

    // Ajouter le média au point
    point.medias.push(savedMedia._id as any);
    await point.save();

    res.status(201).json(savedMedia);
  } catch (error) {
    next(error);
  }
};

// Récupérer les médias d'un point
const getPointMedias: RequestHandler<{ pointId: string }> = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { pointId } = req.params;
    const medias = await Media.find({ pointId }).sort({ order: 1 });

    res.status(200).json(medias);
  } catch (error) {
    next(error);
  }
};

// Supprimer un média
const deleteMedia: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { id } = req.params;
    const media = await Media.findById(id);

    if (!media) {
      res.status(404).json({ error: 'Média non trouvé.' });
      return;
    }

    // Supprimer la référence du média dans le point
    await Point.findByIdAndUpdate(
      media.pointId,
      { $pull: { medias: id } }
    );

    await Media.deleteOne({ _id: id });
    res.status(200).json({ message: 'Média supprimé avec succès.' });
  } catch (error) {
    next(error);
  }
};

// Routes
router.post('/', createMedia);
router.get('/point/:pointId', getPointMedias);
router.delete('/:id', deleteMedia);

export default router;
