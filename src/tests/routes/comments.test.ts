import { describe, expect, it, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Point } from '../../models/Points';
import { Comment } from '../../models/Comments';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await Comment.deleteMany({});
  await Point.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Comment Routes', () => {
  describe('POST /api/comments/:pointId', () => {
    it('devrait ajouter un commentaire valide pour un point', async () => {
      const point = await Point.create({ 
        name: 'Colisée', 
        description: 'Ancien amphithéâtre romain', 
        coordinates: [12.4922, 41.8902], 
        category: 'historical' 
      });

      const response = await request(app).post(`/api/comments/${point._id}`).send({
        content: 'Incroyable site historique !',
        userId: new mongoose.Types.ObjectId().toString(),
      });

      expect(response.status).toBe(201);
      expect(response.body.content).toBe('Incroyable site historique !');
    });
  });

  describe('GET /api/comments/:pointId', () => {
    it('devrait renvoyer tous les commentaires d\'un point', async () => {
      const point = await Point.create({ 
        name: 'Mont Everest', 
        description: 'Plus haute montagne du monde', 
        coordinates: [86.925, 27.9881], 
        category: 'nature' 
      });

      await Comment.create({ 
        content: 'Magnifique vue !', 
        userId: new mongoose.Types.ObjectId(), 
        pointId: point._id 
      });

      const response = await request(app).get(`/api/comments/${point._id}`);
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});
