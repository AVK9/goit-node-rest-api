const request = require('supertest');
const app = require('../../app');
const {
  expect,
  describe,
  test,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
} = require('@jest/globals');

const mongoose = require('mongoose');
const { DB_HOST, PORT = 3000 } = process.env;

mongoose.set('strictQuery', true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log('Database connection successful');
    });
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  });

describe('POST /users/login', () => {
  beforeAll(() => console.log('BEFORE ALL'));
  beforeEach(() => console.log('BEFORE EACH'));
  afterEach(() => console.log('AFTER EACH'));
  afterAll(() => console.log('AFTER ALL'));

  test('test response status and token', async () => {
    const testData = {
      email: 'AlexKat@example.com',
      password: 'examplepassword',
    };

    const res = await request(app).post('/users/login').send(testData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.objectContaining({
          email: expect.any(String),
          subscription: expect.any(String),
        }),
      })
    );
  }, 5000);

  test('should returns 401 error I', async () => {
    const testData = {
      email: 'AlexKat@example.com',
      password: 'examplepassword2',
    };
    const res = await request(app).post('/users/login').send(testData);

    expect(res.status).toBe(401);
  }, 5000);

  test('should returns 400 error II', async () => {
    const testData = {
      email: 'AlexKat@example.com',
    };

    const res = await request(app).post('/users/login').send(testData);

    expect(res.statusCode).toBe(400);
  });
});
