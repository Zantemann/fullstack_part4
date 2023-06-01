const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const notes = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(notes)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId)

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url is missing' })
  }

  const blog = new Blog({
    url: body.url,
    title: body.title,
    author: body.author,
    user: user._id,
    likes: body.likes !== undefined ? body.likes : 0,
  })

  const savedNote = await blog.save()
  user.blogs = user.blogs.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }

    const updated = await Blog
      .findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updated)
  } catch (error) {
    error => next(error)
  }
})

module.exports = blogsRouter