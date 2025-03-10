import express, { RequestHandler } from 'express';
import { Comment } from '../models/Comments';
import { Point } from '../models/Points';

const router = express.Router();

// Interfaces pour le typage des requêtes
interface CreateCommentBody {
  content: string;
  userId: string;
}

interface CommentParams {
  pointId: string;
}

// Ajouter un commentaire
const createComment: RequestHandler<CommentParams, {}, CreateCommentBody> = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { pointId } = req.params;
    const { content, userId } = req.body;

    if (!content || !userId) {
      res.status(400).json({ error: 'Tous les champs requis ne sont pas remplis.' });
      return;
    }

    const point = await Point.findById(pointId);
    if (!point) {
      res.status(404).json({ error: 'Point non trouvé.' });
      return;
    }

    const comment = new Comment({
      content,
      userId,
      pointId
    });

    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    next(error);
  }
};

// Récupérer les commentaires d'un point
const getPointComments: RequestHandler<CommentParams> = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { pointId } = req.params;
    const comments = await Comment.find({ pointId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username'); // Populate user info if needed

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// Supprimer un commentaire
const deleteComment: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      res.status(404).json({ error: 'Commentaire non trouvé.' });
      return;
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Commentaire supprimé avec succès.' });
  } catch (error) {
    next(error);
  }
};

// Routes
router.post('/:pointId', createComment);
router.get('/:pointId', getPointComments);
router.delete('/:id', deleteComment);

export default router;
