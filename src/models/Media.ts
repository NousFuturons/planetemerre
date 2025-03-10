// src/models/Media.ts
import mongoose, { Document, Schema } from 'mongoose';

// Types de médias supportés
export enum MediaType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  HTML = 'html'
}

// Interface pour les métadonnées spécifiques à chaque type de média
interface IMetadata {
  // Métadonnées pour les images
  image?: {
    width: number;
    height: number;
    format: string;
    size: number;  // en bytes
    alt?: string;  // texte alternatif pour accessibilité
  };
  // Métadonnées pour les vidéos
  video?: {
    duration: number;  // en secondes
    format: string;
    size: number;
    thumbnail?: string;  // URL de la vignette
  };
  // Métadonnées pour l'audio
  audio?: {
    duration: number;
    format: string;
    size: number;
  };
  // Métadonnées pour le texte
  text?: {
    wordCount: number;
    language: string;
    format: 'plain' | 'markdown' | 'rich';
  };
  // Métadonnées pour le HTML
  html?: {
    version: string;  // version HTML utilisée
    scripts: boolean;  // présence de scripts
    styles: boolean;  // présence de styles
  };
}

// Interface principale pour le modèle Media
interface IMedia extends Document {
  title: string;
  description?: string;
  type: MediaType;
  content: string;  // URL pour les médias externes, contenu pour text/html
  metadata: IMetadata;
  pointId: mongoose.Types.ObjectId;  // Référence au Point d'intérêt
  userId: mongoose.Types.ObjectId;   // Créateur du média
  order: number;    // Ordre d'affichage dans le point d'intérêt
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Schéma pour les métadonnées
const MetadataSchema = new Schema({
  image: {
    width: Number,
    height: Number,
    format: String,
    size: Number,
    alt: String
  },
  video: {
    duration: Number,
    format: String,
    size: Number,
    thumbnail: String
  },
  audio: {
    duration: Number,
    format: String,
    size: Number
  },
  text: {
    wordCount: Number,
    language: String,
    format: {
      type: String,
      enum: ['plain', 'markdown', 'rich']
    }
  },
  html: {
    version: String,
    scripts: Boolean,
    styles: Boolean
  }
}, {
  _id: false  // Pas besoin d'ID pour le sous-document
});

// Schéma principal pour les médias
const MediaSchema = new Schema<IMedia>({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },
  type: {
    type: String,
    enum: Object.values(MediaType),
    required: [true, 'Le type de média est requis']
  },
  content: {
    type: String,
    required: [true, 'Le contenu est requis'],
    validate: {
      validator: function(this: IMedia, v: string) {
        // Validation selon le type de média
        switch(this.type) {
          case MediaType.IMAGE:
          case MediaType.VIDEO:
          case MediaType.AUDIO:
            return /^https?:\/\/.+/.test(v);  // Vérifie si c'est une URL valide
          case MediaType.TEXT:
            return v.length > 0;  // Vérifie si le texte n'est pas vide
          case MediaType.HTML:
            return /<[^>]*>/g.test(v);  // Vérifie la présence de balises HTML
          default:
            return false;
        }
      },
      message: 'Contenu invalide pour le type de média spécifié'
    }
  },
  metadata: {
    type: MetadataSchema,
    required: true,
    validate: {
      validator: function(this: IMedia, v: IMetadata) {
        // Vérifie que les métadonnées correspondent au type de média
        return v[this.type] !== undefined;
      },
      message: 'Les métadonnées ne correspondent pas au type de média'
    }
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
  },
  order: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index pour améliorer les performances des recherches
MediaSchema.index({ pointId: 1, order: 1 });
MediaSchema.index({ tags: 1 });
MediaSchema.index({ type: 1 });
MediaSchema.index({ status: 1 });

// Middleware pour la validation des métadonnées avant sauvegarde
MediaSchema.pre('save', function(next) {
  const media = this as IMedia;
  
  // Validation spécifique selon le type
  switch(media.type) {
    case MediaType.IMAGE:
      if (!media.metadata.image) {
        return next(new Error('Métadonnées d\'image requises'));
      }
      break;
    case MediaType.VIDEO:
      if (!media.metadata.video) {
        return next(new Error('Métadonnées de vidéo requises'));
      }
      break;
    case MediaType.AUDIO:
      if (!media.metadata.audio) {
        return next(new Error('Métadonnées audio requises'));
      }
      break;
    case MediaType.TEXT:
      if (!media.metadata.text) {
        return next(new Error('Métadonnées de texte requises'));
      }
      break;
    case MediaType.HTML:
      if (!media.metadata.html) {
        return next(new Error('Métadonnées HTML requises'));
      }
      break;
  }
  
  next();
});

// Méthodes statiques pour la gestion des médias
MediaSchema.statics = {
  // Trouve tous les médias d'un point d'intérêt, triés par ordre
  async findByPointId(pointId: mongoose.Types.ObjectId) {
    return this.find({ pointId }).sort('order').exec();
  },
  
  // Trouve tous les médias d'un type spécifique
  async findByType(type: MediaType) {
    return this.find({ type, status: 'published' }).exec();
  }
};

export const Media = mongoose.model<IMedia>('Media', MediaSchema);
