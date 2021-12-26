const jwt = require('jsonwebtoken')
const request = require('supertest')
const dotenv = require('dotenv')
const app = require('../server')
const mongoose = require("mongoose");

dotenv.config({ path: '.env.test' })

jest.setTimeout(20000);

describe('notify api test', () => {
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

  describe('notify create', () => {
    it('create notify', async () => {
      const notify = {
        id: '61b64c26c1ada75b129bada2',
        recipients: [],
        url: '/post/61b64c26c1ada75b129bada2',
        text: 'added a new post.',
        content: 'added a new post content',
        image: 'https://res.cloudinary.com/devat-channel/image/upload/v1639336997/v-network/xp1vawat8dy2okg8fgw2.png'
      }
      await request(app)
        .post('/api/notify')
        .send(notify)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          const notifyResp = response.body.notify
          expect(notifyResp).toMatchObject(
            expect.objectContaining({
              id: expect.any(String),
              recipients: expect.any(Array),
              url: expect.any(String),
              text: expect.any(String),
              content: expect.any(String),
              image: expect.any(String),
            }),
          )
        })
    })
  })

  describe('notify delete', () => {
    it('delete notify', async () => {
      const notify = {
        id: '61b64c26c1ada75b129bada2',
        recipients: [],
        url: '/post/61b64c26c1ada75b129bada2',
        text: 'added a new post.',
        content: 'added a new post content',
        image: 'https://res.cloudinary.com/devat-channel/image/upload/v1639336997/v-network/xp1vawat8dy2okg8fgw2.png'
      }
      await request(app)
        .post('/api/notify')
        .send(notify)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(async () => {
          await request(app)
            .delete('/api/notify/' + notify.id)
            .query({ url: notify.url })
            .set('Authorization', access_token)
            .expect('Content-Type', /json/)
            .expect(200)
        })
    })
  })

  describe('notify get', () => {
    it('get notifies', async () => {
      await request(app)
        .get('/api/notifies')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          const notifies = response.body.notifies;
          expect(notifies.length).toBeGreaterThanOrEqual(0)
        })
    })
  })

  describe('notify patch', () => {
    it('update notify isRead status', async () => {
      await request(app)
        .patch('/api/isReadNotify/61c193035e9665046cc9aeb8')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })

  describe('notify delete', () => {
    it('delete all notify by user', async () => {
      await request(app)
        .delete('/api/deleteAllNotify')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })
})
