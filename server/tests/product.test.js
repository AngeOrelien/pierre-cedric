process.env.NODE_ENV = 'test';
process.env.DB_PATH  = ':memory:';
process.env.JWT_SECRET = 'test_secret';

const request = require('supertest');
const app     = require('../config/app');
const { syncDatabase, User, Cart } = require('../models');
const bcrypt  = require('bcryptjs');

let adminToken;

beforeAll(async () => {
  await syncDatabase();
  const admin = await User.create({
    firstName:'Admin', lastName:'PC', email:'admin@pc.cm',
    password: await bcrypt.hash('Admin1234!', 12), role:'admin'
  });
  await Cart.create({ userId: admin.id });
  const res = await request(app).post('/api/auth/login')
    .send({ email:'admin@pc.cm', password:'Admin1234!' });
  adminToken = res.body.token;
});

describe('GET /api/products', () => {
  it('retourne une liste paginée', async () => {
    const res = await request(app).get('/api/products?page=1&limit=5');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(Array.isArray(res.body.products)).toBe(true);
  });
});

describe('POST /api/products', () => {
  it('refuse sans token admin', async () => {
    const res = await request(app).post('/api/products').send({ name:'Test' });
    expect(res.status).toBe(401);
  });
  it('crée un produit avec token admin', async () => {
    const res = await request(app).post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name:'iPhone 15 Pro', price:950000, sku:'IP15PRO-001', stock:10 });
    expect(res.status).toBe(201);
    expect(res.body.product.slug).toBe('iphone-15-pro');
  });
});
