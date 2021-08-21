import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should handle a signup request', () => {
    const sentEmail = 'unique@email.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: sentEmail, password: 'secretPassword' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(sentEmail);
      });
  });

  it('should handle a signup request and get current signed user', async () => {
    const sentEmail = 'unique@email.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: sentEmail, password: 'secretPassword' })
      .expect(201);
    
    const cookie = res.get('Set-Cookie');
    
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
    
    expect(body.email).toEqual(sentEmail);
  });
});
