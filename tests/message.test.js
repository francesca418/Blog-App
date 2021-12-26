const jwt = require('jsonwebtoken')
const request = require('supertest')
const dotenv = require('dotenv')
const app = require('../server')
const mongoose = require("mongoose");

dotenv.config({ path: '.env.test' })

jest.setTimeout(20000);

describe('message api test', () => {
  let access_token

  beforeAll(() => {
    const payload = {
      id: '61b9037ff5126af338d02a8a' // test user id
    }
    access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
  })

  afterAll(async () => {
    await mongoose.connection.close()
    app.close()
  })

  afterEach(done => {
    done()
  })

  describe('message create', () => {
    it('create message', async () => {
      const message = {
        sender: '61b63a521c864735b295e6ac',
        recipient: '61b63a521c864735b295e6ac',
        text: 'test text',
        media: []
      }
      await request(app)
        .post('/api/message')
        .send(message)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body.msg).toBe('Create Success!');
        })
    })
  })

  describe('conversations get', () => {
    it('get conversations', async () => {
      await request(app)
        .get('/api/conversations')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject(
            expect.objectContaining({
              conversations: expect.any(Array),
              result: expect.any(Number),
            }),
          )
        })
    })
  })

  describe('message get', () => {
    it('get message by id', async () => {
      await request(app)
        .get('/api/message/61c283c3c9e5303cdcb773b9')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject(
            expect.objectContaining({
              messages: expect.any(Array),
              result: expect.any(Number),
            }),
          )
        })
    })
  })

  describe('message delete', () => {
    it('delete message by not existing id', async () => {
      await request(app)
        .delete('/api/message/61c283c3c9e5303cdcb77333')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body.msg).toBe('Delete Success!')
        })
    })
  })

  describe('conversation delete', () => {
    it('delete conversation by not existing id', async () => {
      await request(app)
        .delete('/api/conversation/61c283c3c9e5303cdcb77333')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(500)
    })
  })
})
