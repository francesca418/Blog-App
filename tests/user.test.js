const jwt = require('jsonwebtoken')
const request = require('supertest')
const dotenv = require('dotenv')
const app = require('../server')
const mongoose = require("mongoose");

dotenv.config({ path: '.env.test' })

jest.setTimeout(20000);

describe('user api test', () => {
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

  describe('user search', () => {
    it('search without query username', async () => {
      await request(app)
        .get('/api/search')
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(500)
    })

    it('search with existing username', async () => {
      await request(app)
        .get('/api/search')
        .query({
          username: 'test',
        })
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          const users = response.body.users
          expect(users.length).toBeGreaterThanOrEqual(4);
          const findUser = users.find(user => user.username === 'test')
          expect(findUser).toBeDefined()
        })
    })

    it('search with not existing username', async () => {
      await request(app)
        .get('/api/search')
        .query({
          username: 'user name that not existing',
        })
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          const users = response.body.users
          expect(users.length).toBe(0)
        })
    })
  })

  describe('user get', () => {
    it('get user by existing id', async () => {
      const userId = '61b9037ff5126af338d02a8a';

      await request(app)
        .get('/api/user/' + userId)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          const user = response.body.user
          expect(user).toBeDefined()
        })
    })

    it('get user by not existing id', async () => {
      const userId = '61b9023b82537af1fa451114';

      await request(app)
        .get('/api/user/' + userId)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('get user by error id', async () => {
      const userId = 'error_id';

      await request(app)
        .get('/api/user/' + userId)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(500)
    })
  })

  describe('user update', () => {
    it('update user without fullname', async () => {
      const user = {
        avatar: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png',
        fullname: '',
        mobile: '',
        address: '',
        gender: 'male',
        password: ''
      }
      await request(app)
        .patch('/api/user')
        .send(user)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('update user gender with empty password', async () => {
      const user = {
        avatar: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png',
        fullname: 'test',
        mobile: '',
        address: '',
        gender: 'female',
        password: ''
      }
      await request(app)
        .patch('/api/user')
        .send(user)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
    })

    it('update user gender with empty password', async () => {
      const user = {
        avatar: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png',
        fullname: 'test',
        mobile: '',
        address: '',
        gender: 'female',
        password: ''
      }
      await request(app)
        .patch('/api/user')
        .send(user)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
    })

    it('update user with invalid password', async () => {
      const user = {
        avatar: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png',
        fullname: 'test',
        mobile: '',
        address: '',
        gender: 'female',
        password: '123'
      }
      await request(app)
        .patch('/api/user')
        .send(user)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('update user with valid password', async () => {
      const user = {
        avatar: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png',
        fullname: 'test',
        mobile: '',
        address: '',
        gender: 'male',
        password: 'tT123456'
      }
      await request(app)
        .patch('/api/user')
        .send(user)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })

  describe('user update password', () => {
    it('update user password without email', async () => {
      const body = {
        username: 'test',
        password: 'tT123456'
      }
      await request(app)
        .patch('/api/changePassword')
        .send(body)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('update user password without username', async () => {
      const body = {
        email: 'test@test.com',
        password: 'tT123456'
      }
      await request(app)
        .patch('/api/changePassword')
        .send(body)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('update user password without password', async () => {
      const body = {
        email: 'test@test.com',
        username: 'test'
      }
      await request(app)
        .patch('/api/changePassword')
        .send(body)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('update user password with invalid password', async () => {
      const body = {
        email: 'test@test.com',
        username: 'test',
        password: '123',
      }
      await request(app)
        .patch('/api/changePassword')
        .send(body)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('update user password with valid password', async () => {
      const body = {
        email: 'test@test.com',
        username: 'test',
        password: 'tT123456',
      }
      await request(app)
        .patch('/api/changePassword')
        .send(body)
        .set('Authorization', access_token)
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })

  // describe('user follow', () => {
  //   it('follow user that has followed', async () => {
  //     await request(app)
  //       .patch('/api/user/61b905f5d84637f4dd513ec2/follow')
  //       .set('Authorization', access_token)
  //       .expect('Content-Type', /json/)
  //       .expect(500)
  //   })
  //
  //   it('follow user that has not followed', async () => {
  //     await request(app)
  //       .patch('/api/user/61c1555eda99840adcfe4c76/follow')
  //       .set('Authorization', access_token)
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //   })
  // })
  //
  // describe('user unfollow', () => {
  //   it('unfollow user that has followed', async () => {
  //     await request(app)
  //       .patch('/api/user/61c1555eda99840adcfe4c76/unfollow')
  //       .set('Authorization', access_token)
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //   })
  // })
  //
  // describe('user suggestions', () => {
  //   it('/api/suggestionsUser', async () => {
  //     await request(app)
  //       .get('/api/suggestionsUser')
  //       .set('Authorization', access_token)
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //       .then(response => {
  //         expect(response.body).toMatchObject(
  //           expect.objectContaining({
  //             users: expect.any(Array),
  //             result: expect.any(Number),
  //           }),
  //         )
  //       })
  //   })
  // })
})
