const jwt = require('jsonwebtoken')
const request = require('supertest')
const dotenv = require('dotenv')
const app = require('../server')
const mongoose = require("mongoose");

dotenv.config({ path: '.env.test' })

jest.setTimeout(20000);

describe('group api test', () => {
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

  describe('group create', () => {
    it('create group', async () => {
      const group = {
        name: 'test group' + Date.now(),
        privacy: true,
        tags: ['test tag']
      }
      await request(app)
        .post('/api/groups')
        .send(group)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject(
            expect.objectContaining({
              msg: 'Created Group!',
              newGroup: expect.any(Object),
            }),
          )
        })
    })
  })

  describe('group get', () => {
    it('get all group', async () => {
      await request(app)
        .get('/api/groups')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject(
            expect.objectContaining({
              msg: 'Success!',
              result: expect.any(Number),
              groups: expect.any(Array)
            }),
          )
        })
    })

    it('get group by not existing id', async () => {
      await request(app)
        .get('/api/group/61c2991038b9171de803b520')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body.group).toMatchObject(
            expect.objectContaining({
              name: expect.any(String),
              privacy: expect.any(Boolean),
              tags: expect.any(Array),
            }),
          )
        })
    })

    it('get user group by id', async () => {
      await request(app)
        .get('/api/user_groups/61b9037ff5126af338d02a8a')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject(
            expect.objectContaining({
              groups: expect.any(Array),
              result: expect.any(Number),
            }),
          )
        })
    })

    it('get suggestions group', async () => {
      await request(app)
        .get('/api/suggestionsGroup')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject(
            expect.objectContaining({
              groups: expect.any(Array),
              result: expect.any(Number),
            }),
          )
        })
    })
  })

  describe('group delete', () => {
    it('delete group by id', async () => {
      const group = {
        name: 'test group' + Date.now(),
        privacy: true,
        tags: ['test tag']
      }
      await request(app)
        .post('/api/groups')
        .send(group)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(async response => {
          const groupId = response.body.newGroup._id
          await request(app)
            .delete('/api/group/' + groupId)
            .set('Authorization', access_token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response1 => {
              expect(response1.body.msg).toBe('Deleted Post!')
            })
        })
    })
  })

  describe('group join and leave', () => {
    it('join group that already joined', async () => {
      await request(app)
        .patch('/api/group/61c2991038b9171de803b520/join')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('join group that not existing group id', async () => {
      await request(app)
        .patch('/api/group/61c185fb6a50ecf89e3c4aaa/join')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('leave group that not existing group id', async () => {
      await request(app)
        .patch('/api/group/61c185fb6a50ecf89e3c4aaa/leave')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('leave group', async () => {
      await request(app)
        .patch('/api/group/61c185fb6a50ecf89e3c4a4a/leave')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body.msg).toBe('Left Group!')
        })
    })

    it('join group', async () => {
      await request(app)
        .patch('/api/group/61c185fb6a50ecf89e3c4a4a/join')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body.msg).toBe('Joined Group!')
        })
    })
  })
})
