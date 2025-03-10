import mongoose, { Document, Schema } from 'mongoose';

interface IComment extends Document {
  content: string;
  pointId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  content: {
    type: String,
    required: [true, 'Le contenu est requis'],
    trim: true,
    maxlength: [500, 'Le commentaire ne peut pas dépasser 500 caractères']
  },
  pointId: {
    type: Schema.Types.ObjectId,
    ref: 'Point',
    required: [true, 'Le point d\'intérêt associé est requis']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis']
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances des recherches
CommentSchema.index({ pointId: 1, createdAt: -1 });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
