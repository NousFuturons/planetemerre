import { describe, expect, it, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Media } from '../../models/Media';
import { Point } from '../../models/Points';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await Media.deleteMany({});
  await Point.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Media Routes', () => {
  describe('POST /api/media', () => {
    it('devrait ajouter un média valide à un point', async () => {
      const point: any = await Point.create({ 
        name: 'Louvre', 
        description: 'Musée historique', 
        coordinates: [2.3364, 48.8609], 
        category: 'historical' 
      });

      const response = await request(app).post('/api/media').send({
        title: 'Vue aérienne du Louvre',
        type: 'image',
        content: 'https://example.com/louvre.jpg',
        pointId: point._id.toString(),
      });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Vue aérienne du Louvre');
    });

    it('devrait rejeter une requête avec un point non valide', async () => {
      const response = await request(app).post('/api/media').send({
        title: 'Vue aérienne',
        type: 'image',
        content: 'https://example.com/image.jpg',
        pointId: '626c3c7a25eaf44dc8225f0f',
      });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/media/point/:pointId', () => {
    it('devrait renvoyer tous les médias d\'un point', async () => {
      const point = await Point.create({
        name: 'Statue de la Liberté',
        description: 'Monument à New York',
        coordinates: [-74.0445, 40.6892],
        category: 'historical',
      });

      await Media.create({
        title: 'Photo de la Statue de la Liberté',
        type: 'image',
        content: 'https://example.com/statue.jpg',
        pointId: point._id,
      });

      const response = await request(app).get(`/api/media/point/${point._id}`);
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});
