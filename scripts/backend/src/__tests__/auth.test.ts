import request from 'supertest';
import { app } from '../app';

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    test('新規ユーザー登録ができる', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test1234!',
          name: 'テストユーザー'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('test@example.com');
    });

    test('不正なメールアドレスでエラー', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Test1234!',
          name: 'テストユーザー'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    test('正しい認証情報でログインできる', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test1234!'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    test('間違ったパスワードでエラー', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/auth/me', () => {
    test('認証なしでアクセスできない', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.status).toBe(401);
    });
  });
});