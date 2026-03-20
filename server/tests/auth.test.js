/**
 * Tests Auth — register & login
 * Utilise SQLite en mémoire (:memory:) pour isoler les tests
 */
process.env.NODE_ENV = 'test';
process.env.DB_PATH  = ':memory:';
process.env.JWT_SECRET = 'test_secret';

const request = require('supertest');
const app     = require('../config/app');
const { syncDatabase } = require('../models');

beforeAll(async () => { await syncDatabase(); });

const user = { firstName:'Jean', lastName:'Dupont', email:'jean@test.cm', password:'Password1!' };

describe('POST /api/auth/register', () => {
  it('crée un compte et retourne un token', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('customer');
    expect(res.body.user.password).toBeUndefined();
  });
  it('rejette un email déjà utilisé', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(409);
  });
  it('rejette les champs manquants', async () => {
    const res = await request(app).post('/api/auth/register').send({ email:'a@b.cm' });
    expect(res.status).toBe(422);
  });
});

describe('POST /api/auth/login', () => {
  it('connecte avec bons identifiants', async () => {
    const res = await request(app).post('/api/auth/login')
      .send({ email: user.email, password: user.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
  it('rejette un mauvais mot de passe', async () => {
    const res = await request(app).post('/api/auth/login')
      .send({ email: user.email, password: 'wrong' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('retourne le profil avec un token valide', async () => {
    const login = await request(app).post('/api/auth/login')
      .send({ email: user.email, password: user.password });
    const res = await request(app).get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(user.email);
  });
  it('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
