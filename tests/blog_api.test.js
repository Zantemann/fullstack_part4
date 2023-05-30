const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns blogs with an "id" field', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined()
    })
  })
})

describe('POST /api/blogs', () => {
  test('a new blog can be added', async () => {
    const blogsBeforeAddition = await api.get('/api/blogs')

    const newBlog = {
      title: 'Moi',
      author: 'Matti Meikäläinen',
      url: 'http://google.com',
      likes: 11,
    }

    await api.post('/api/blogs').send(newBlog).expect(201)

    const blogsAfterAddition = await api.get('/api/blogs')

    expect(blogsAfterAddition.body).toHaveLength(blogsBeforeAddition.body.length + 1)
  })

  test('if likes property is missing, it is set to 0', async () => {
    const noLikesBlog = {
      title: 'Moi',
      author: 'Matti Meikäläinen',
      url: 'http://google.com',
    }
    const response = await api.post('/api/blogs').send(noLikesBlog).expect(201)

    expect(response.body.likes).toBe(0)
  })

  test('if title or url is missing, responds with status code 400 Bad Request', async () => {
    const blogWithoutTitle = {
      author: 'Matti Meikäläinen',
      url: 'http://google.com',
      likes: 11,
    }

    const blogWithoutUrl = {
      title: 'Moi',
      author: 'Matti Meikäläinen',
      likes: 11,
    }

    await api.post('/api/blogs').send(blogWithoutTitle).expect(400)
    await api.post('/api/blogs').send(blogWithoutUrl).expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})