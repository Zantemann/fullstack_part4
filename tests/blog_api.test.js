const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Moi',
    author: 'Matti Meikäläinen',
    url: 'http://google.com',
    likes: 11,
  },
  {
    title: 'Moi2',
    author: 'Matti Meikäläinen2',
    url: 'http://google.com',
    likes: 1,
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns blogs with an "id" field', async () => {
    const response = await api.get('/api/blogs').expect(200)

    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined()
    })
  })
})

describe('POST /api/blogs', () => {
  test('a new blog can be added', async () => {
    const blogsBeforeAddition = await api.get('/api/blogs').expect(200)

    const newBlog = {
      title: 'Moi',
      author: 'Matti Meikäläinen',
      url: 'http://google.com',
      likes: 11,
    }

    await api.post('/api/blogs').send(newBlog).expect(201)

    const blogsAfterAddition = await api.get('/api/blogs').expect(200)

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

describe('DELETE /api/blogs/:id', () => {
  test('blog can be deleted', async () => {
    const response = await api.get('/api/blogs').expect(200)
    const blogsBeforeDeletion = response.body

    const blogToDelete = blogsBeforeDeletion[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAfterDeletion = await api.get('/api/blogs').expect(200)

    expect(blogsAfterDeletion).not.toContain(blogToDelete.content)
  })
})

describe('PUT /api/blogs/:id', () => {
  test('likes of blog can be updated', async () => {
    const response = await api.get('/api/blogs').expect(200)
    const blogsBeforeUpdate = response.body

    const blogToUpdate = blogsBeforeUpdate[0]

    const updatedLikes = blogToUpdate.likes + 10

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ ...blogToUpdate, likes: updatedLikes })
      .expect(200)

    const updatedBlogsResponse = await api.get('/api/blogs').expect(200)
    const updatedBlogs = updatedBlogsResponse.body

    const updatedBlog = updatedBlogs.find(blog => blog.id === blogToUpdate.id)

    expect(updatedBlog.likes).toEqual(updatedLikes)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})