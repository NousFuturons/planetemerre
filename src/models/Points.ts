import mongoose, { Document, Schema } from 'mongoose';

// Interface définissant la structure d'un point d'intérêt
interface IPoint extends Document {
  name: string;
  description: string;
  coordinates: [number, number]; // [longitude, latitude]
  category: 'patrimoine' | 'écosystèmes' | 'urban';
  medias: mongoose.Types.ObjectId[]; // Référence aux médias
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schéma Mongoose pour les points d'intérêt
const PointSchema = new Schema<IPoint>({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true,
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },
  coordinates: {
    type: [Number],
    required: [true, 'Les coordonnées sont requises'],
    index: '2dsphere', // Index géospatial pour les requêtes de proximité
    validate: {
      validator: function(v: number[]) {
        return v.length === 2 && 
               v[0] >= -180 && v[0] <= 180 && // longitude
               v[1] >= -90 && v[1] <= 90;     // latitude
      },
      message: 'Coordonnées invalides'
    }
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: {
      values: ['historical', 'nature', 'urban'],
      message: 'Catégorie non valide'
    }
  },
  medias: [{
    type: Schema.Types.ObjectId,
    ref: 'Media'
  }],
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Le nombre de likes ne peut pas être négatif']
  }
}, {
  timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  toJSON: { virtuals: true }, // Inclut les champs virtuels lors de la conversion en JSON
  toObject: { virtuals: true }
});

// Index pour améliorer les performances des recherches
PointSchema.index({ name: 'text', description: 'text' });

// Méthode virtuelle pour formater les coordonnées
PointSchema.virtual('location').get(function() {
  return {
    type: 'Point',
    coordinates: this.coordinates
  };
});

export const Point = mongoose.model<IPoint>('Point', PointSchema);
