const jwt = require('jsonwebtoken')
const request = require('supertest')
const dotenv = require('dotenv')
const app = require('../server')
const mongoose = require("mongoose");

dotenv.config({ path: '.env.test' })

jest.setTimeout(20000);

describe('comment api test', () => {
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

  describe('comment create', () => {
    it('create comment with not existing post id', async () => {
      const comment = {
        postId: '61c13396c1169abea17a9999',
        content: 'test content',
        postUserId: '61b66894fdd1f35d60fe78a9'
      }
      await request(app)
        .post('/api/comment')
        .send(comment)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('create comment with invalid reply', async () => {
      const comment = {
        postId: '61c13396c1169abea17a9ea5',
        content: 'test content',
        reply: '61b68d24b702326984310ddd',
        postUserId: '61b66894fdd1f35d60fe78a9'
      }
      await request(app)
        .post('/api/comment')
        .send(comment)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('create comment with existing post id', async () => {
      const comment = {
        postId: '61c13396c1169abea17a9ea5',
        content: 'test content',
        postUserId: '61b66894fdd1f35d60fe78a9'
      }
      await request(app)
        .post('/api/comment')
        .send(comment)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body.newComment).toMatchObject(
            expect.objectContaining({
              postId: expect.any(String),
              content: expect.any(String),
              postUserId: expect.any(String),
            }),
          )
        })
    })
  })

  describe('comment update', () => {
    it('update comment', async () => {
      await request(app)
        .patch('/api/comment/61c27cf4789a7e3a2ccf4f30')
        .send({ content: 'update content' })
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body.msg).toBe('Update Success!')
        })
    })
  })

  describe('comment like and unlike', () => {
    it('like comment that not yet liked', async () => {
      await request(app)
        .patch('/api/comment/61c27cf4789a7e3a2ccf4f30/like')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body.msg).toBe('Liked Comment!')
        })
    })

    it('like comment that already liked', async () => {
      await request(app)
        .patch('/api/comment/61c27cf4789a7e3a2ccf4f30/like')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('unlike comment that already liked', async () => {
      await request(app)
        .patch('/api/comment/61c27cf4789a7e3a2ccf4f30/unlike')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body.msg).toBe('UnLiked Comment!')
        })
    })
  })

  describe('comment delete', () => {
    it('delete comment', async () => {
      const comment = {
        postId: '61c13396c1169abea17a9ea5',
        content: 'test content',
        postUserId: '61b66894fdd1f35d60fe78a9'
      }
      await request(app)
        .post('/api/comment')
        .send(comment)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(async response => {
          const newComment = response.body.newComment;
          await request(app)
            .delete('/api/comment/' + newComment._id)
            .set('Authorization', access_token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response1 => {
              expect(response1.body.msg).toBe('Deleted Comment!')
            })
        })
    })
  })
})
