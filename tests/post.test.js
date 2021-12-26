const jwt = require('jsonwebtoken')
const request = require('supertest')
const dotenv = require('dotenv')
const app = require('../server')
const mongoose = require("mongoose");

dotenv.config({ path: '.env.test' })

jest.setTimeout(20000);

describe('post api test', () => {
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

  describe('post create', () => {
    it('create post with not existing group id', async () => {
      const post = {
        content: 'tent content',
        images: [],
        groupId: '61c185fb6a50ecf89e3c4aaa'
      }
      await request(app)
        .post('/api/posts')
        .send(post)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('create post with empty content', async () => {
      const post = {
        content: '',
        images: [],
        groupId: '61c185fb6a50ecf89e3c4a4a'
      }
      await request(app)
        .post('/api/posts')
        .send(post)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('create post with existing group id', async () => {
      const post = {
        content: 'tent content',
        images: [],
        groupId: '61c185fb6a50ecf89e3c4a4a'
      }
      await request(app)
        .post('/api/posts')
        .send(post)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject(
            expect.objectContaining({
              msg: 'Created Post!',
              newPost: expect.any(Object),
            }),
          )
        })
    })
  })

  describe('get post', () => {
    it('get all post', async () => {
      await request(app)
        .get('/api/posts')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject({
            msg: 'Success!',
            posts: expect.any(Array),
            result: expect.any(Number),
          })
        })
    })

    it('get post by id', async () => {
      await request(app)
        .get('/api/post/61c2a419ec3dc03cf02dcc47')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject({
            post: expect.any(Object),
          })
        })
    })

    it('get post by user id', async () => {
      await request(app)
        .get('/api/user_posts/61b9037ff5126af338d02a8a')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject({
            posts: expect.any(Array),
            result: expect.any(Number)
          })
        })
    })

    // it('get saved post', async () => {
    //   await request(app)
    //     .get('/api/getSavePosts')
    //     .set('Authorization', access_token)
    //     .expect('Content-Type', /json/)
    //     .expect(200)
    //     .then(response => {
    //       expect(response.body).toMatchObject({
    //         savePosts: expect.any(Array),
    //         result: expect.any(Number),
    //       })
    //     })
    // })
  })

  describe('post update', () => {
    it('update post by id', async () => {
      await request(app)
        .patch('/api/post/61c2a419ec3dc03cf02dcc47')
        .send({
          content: 'test content1',
          images: [],
        })
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toMatchObject({
            msg: 'Updated Post!',
            newPost: expect.any(Object),
          })
        })
    })
  })

  describe('post like and unlike', () => {
    it('unlike post that not existing', async () => {
      await request(app)
        .patch('/api/post/61c2a419ec3dc03cf02dcccc/unlike')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('like post that not yet liked', async () => {
      await request(app)
        .patch('/api/post/61c2a419ec3dc03cf02dcc47/like')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body.msg).toBe('Liked Post!')
        })
    })

    it('like post that already liked', async () => {
      await request(app)
        .patch('/api/post/61c2a419ec3dc03cf02dcc47/like')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('unlike post that existing', async () => {
      await request(app)
        .patch('/api/post/61c2a419ec3dc03cf02dcc47/unlike')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body.msg).toBe('UnLiked Post!')
        })
    })
  })

  // describe('post save and unsave', () => {
  //   it('unsave post', async () => {
  //     await request(app)
  //       .patch('/api/unSavePost/61c2a419ec3dc03cf02dcc47')
  //       .set('Authorization', access_token)
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //       .then(response => {
  //         expect(response.body.msg).toBe('unSaved Post!')
  //       })
  //   })
  //
  //   it('save post', async () => {
  //     await request(app)
  //       .patch('/api/savePost/61c2a419ec3dc03cf02dcc47')
  //       .set('Authorization', access_token)
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //       .then(response => {
  //         expect(response.body.msg).toBe('Saved Post!')
  //       })
  //   })
  // })

  describe('post hide', () => {
    it('hide post', async () => {
      await request(app)
        .patch('/api/hidePost/61c2a419ec3dc03cf02dcc47')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })
})
