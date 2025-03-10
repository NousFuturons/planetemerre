import express, { RequestHandler } from 'express';
import { Comment } from '../models/Comments';
import { Point } from '../models/Points';

const router = express.Router();

interface AddCommentBody {
  content: string;
  userId: string;
}

const addComment: RequestHandler<{ pointId: string }, {}, AddCommentBody> = async (req, res, next) => {
  try {
    const { content, userId } = req.body;
    const { pointId } = req.params;

    const point = await Point.findById(pointId);
    if (!point) {
      res.status(404).json({ error: "Point d'intérêt introuvable." });
      return;
    }

    const comment = new Comment({
      content,
      userId,
      pointId,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

const getComments: RequestHandler<{ pointId: string }> = async (req, res, next) => {
  try {
    const { pointId } = req.params;

    const comments = await Comment.find({ pointId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

const deleteComment: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await Comment.findByIdAndDelete(id);
    if (!result) {
      res.status(404).json({ error: "Commentaire introuvable." });
      return;
    }

    res.status(200).json({ message: "Commentaire supprimé avec succès." });
  } catch (error) {
    next(error);
  }
};

router.post('/:pointId', addComment);
router.get('/:pointId', getComments);
router.delete('/:id', deleteComment);

export default router;
