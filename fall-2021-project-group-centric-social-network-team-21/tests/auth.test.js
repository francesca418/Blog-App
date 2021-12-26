const jwt = require('jsonwebtoken')
const request = require('supertest')
const dotenv = require('dotenv')
const app = require('../server')
const mongoose = require("mongoose");

dotenv.config({ path: '.env.test' })

jest.setTimeout(20000);

describe('auth api test', () => {

  afterAll(async () => {
    await mongoose.connection.close()
    app.close()
  })

  afterEach(done => {
    done()
  })

  describe('register', () => {
    it('register with existing username', async () => {
      const body = {
        fullname: 'test',
        username: 'test',
        email: 'test@test.com',
        password: 'tT123456',
        gender: 'male'
      }
      await request(app)
        .post('/api/register')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('register with existing email', async () => {
      const body = {
        fullname: 'test',
        username: 'test_' + Date.now(),
        email: 'test@test.com',
        password: 'tT123456',
        gender: 'male'
      }
      await request(app)
        .post('/api/register')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('register with invalid password', async () => {
      const body = {
        fullname: 'test',
        username: 'test_' + Date.now(),
        email: 'test_' + Date.now() + '@test.com',
        password: '123',
        gender: 'male'
      }
      await request(app)
        .post('/api/register')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('register with correct body', async () => {
      const body = {
        fullname: 'test',
        username: 'test_' + Date.now(),
        email: 'test_' + Date.now() + '@test.com',
        password: 'tT123456',
        gender: 'male'
      }
      await request(app)
        .post('/api/register')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject(
            expect.objectContaining({
              msg: expect.any(String),
              access_token: expect.any(String),
              user: expect.any(Object)
            }),
          )
        })
    })
  })

  describe('login', () => {
    it('login with not existing email', async () => {
      const body = {
        username: 'test',
        email: 'not_existing_email@test.com',
        password: 'tT123456',
      }
      await request(app)
        .post('/api/login')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('login with not active user', async () => {
      const body = {
        username: 'test',
        email: 'test@test.com',
        password: 'tT123456',
      }
      await request(app)
        .post('/api/login')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('login with unmatched username', async () => {
      const body = {
        username: 'test778',
        email: 'test777@gmail.com',
        password: '123456',
      }
      await request(app)
        .post('/api/login')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => {
          expect(response.body.msg).toBe('Wrong username')
        })
    })

    it('login with correct body', async () => {
      const body = {
        username: 'test777',
        email: 'test777@gmail.com',
        password: '123456',
      }
      await request(app)
        .post('/api/login')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject(
            expect.objectContaining({
              msg: 'Login Success!',
              access_token: expect.any(String),
              user: expect.any(Object)
            }),
          )
        })
    })
  });

  describe('logout', () => {
    it('user logout', async () => {
      await request(app)
        .post('/api/logout')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body.msg).toBe('Logged out!')
        })
    })
  })

  describe('refresh token', () => {
    it('refresh token with not login', async () => {
      await request(app)
        .post('/api/refresh_token')
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('refresh token with login', async () => {
      const payload = {
        id: '61b9037ff5126af338d02a8a' // test user id
      }
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'})

      await request(app)
        .post('/api/refresh_token')
        .set('Cookie', 'refreshtoken=' + refreshToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject(
            expect.objectContaining({
              access_token: expect.any(String),
              user: expect.any(Object)
            }),
          )
        })
    })
  })
})
