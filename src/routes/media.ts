// src/routes/media.ts
import express, { RequestHandler } from 'express';
import { Media, MediaType } from '../models/Media';
import { Point } from '../models/Points';

const router = express.Router();

interface AddMediaBody {
  title: string;
  description?: string;
  type: MediaType;
  content: string;
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
  pointId: string;
  userId: string;
  order?: number;
  tags?: string[];
}

// Ajouter un média
const addMedia: RequestHandler<{}, {}, AddMediaBody> = async (req, res, next) => {
  try {
    const mediaData = req.body;

    // Vérifier si le point existe
    const point = await Point.findById(mediaData.pointId);
    if (!point) {
      res.status(404).json({ error: "Point d'intérêt introuvable." });
      return;
    }

    const media = new Media(mediaData);
    await media.save();

    // Mettre à jour le point avec la référence du média
    await Point.findByIdAndUpdate(
      mediaData.pointId,
      { $push: { medias: media._id } }
    );

    res.status(201).json(media);
  } catch (error) {
    next(error);
  }
};

// Récupérer les médias d'un point
const getPointMedias: RequestHandler<{ pointId: string }> = async (req, res, next) => {
  try {
    const { pointId } = req.params;

    const medias = await Media.find({ pointId })
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json(medias);
  } catch (error) {
    next(error);
  }
};

// Récupérer un média spécifique
const getMedia: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const { id } = req.params;

    const media = await Media.findById(id);
    if (!media) {
      res.status(404).json({ error: "Média introuvable." });
      return;
    }

    res.status(200).json(media);
  } catch (error) {
    next(error);
  }
};

// Mettre à jour un média
const updateMedia: RequestHandler<{ id: string }, {}, Partial<AddMediaBody>> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const media = await Media.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!media) {
      res.status(404).json({ error: "Média introuvable." });
      return;
    }

    res.status(200).json(media);
  } catch (error) {
    next(error);
  }
};

// Supprimer un média
const deleteMedia: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const { id } = req.params;

    const media = await Media.findById(id);
    if (!media) {
      res.status(404).json({ error: "Média introuvable." });
      return;
    }

    // Supprimer la référence du média dans le point
    await Point.findByIdAndUpdate(
      media.pointId,
      { $pull: { medias: id } }
    );

    await Media.findByIdAndDelete(id);
    res.status(200).json({ message: "Média supprimé avec succès." });
  } catch (error) {
    next(error);
  }
};

// Réorganiser l'ordre des médias
const reorderMedias: RequestHandler<{ pointId: string }, {}, { mediaIds: string[] }> = async (req, res, next) => {
  try {
    const { pointId } = req.params;
    const { mediaIds } = req.body;

    // Mettre à jour l'ordre de chaque média
    await Promise.all(mediaIds.map((mediaId, index) => 
      Media.findByIdAndUpdate(mediaId, { order: index })
    ));

    const updatedMedias = await Media.find({ pointId }).sort({ order: 1 });
    res.status(200).json(updatedMedias);
  } catch (error) {
    next(error);
  }
};

// Routes
router.post('/', addMedia);
router.get('/point/:pointId', getPointMedias);
router.get('/:id', getMedia);
router.put('/:id', updateMedia);
router.delete('/:id', deleteMedia);
router.put('/point/:pointId/reorder', reorderMedias);

export default router;
