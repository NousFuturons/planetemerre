// src/backend/server.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Middlewares
app.use(express.json());
app.use(cors());

// Type pour la gestion d'erreur
interface CustomError extends Error {
  status?: number;
}

// Middleware de gestion d'erreur
const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'Une erreur est survenue';
  res.status(status).json({ error: message });
};

// Connexion MongoDB avec gestion des erreurs
const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('URI MongoDB non définie');
    }
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB connecté !');
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

connectDB();

// Route de test
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'API fonctionnelle !' });
});

// Middleware d'erreur
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

export default app;
