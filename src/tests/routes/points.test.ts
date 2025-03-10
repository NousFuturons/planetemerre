import { describe, expect, it, beforeEach, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Point } from '../../models/Points';
import { User } from '../../models/User';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await Point.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Point Routes', () => {
  describe('POST /api/points', () => {
    it('devrait créer un point avec des données valides', async () => {
      const response = await request(app).post('/api/points').send({
        name: 'Tour Eiffel',
        description: 'Un célèbre monument à Paris',
        coordinates: [2.2945, 48.8584],
        category: 'historical',
      });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Tour Eiffel');
    });

    it('devrait rejeter une requête avec des données manquantes', async () => {
      const response = await request(app).post('/api/points').send({
        name: 'Tour Eiffel',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/points', () => {
    it('devrait renvoyer une liste de points', async () => {
      await Point.create({ name: 'Tour Eiffel', description: 'Paris', coordinates: [2.2945, 48.8584], category: 'historical' });
      const response = await request(app).get('/api/points');

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});
