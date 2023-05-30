const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', (request, response) => {
  const { title, author, url, likes } = request.body

  if (!title || !url) {
    return response.status(400).json({ error: 'title or url is missing' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes !== undefined ? likes : 0,
  })

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogsRouter