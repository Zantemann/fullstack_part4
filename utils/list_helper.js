const lodash = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  const total = likes.reduce((sum, like) => sum + like, 0)
  return total
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((currentFavorite, blog) => {
    if (!currentFavorite || blog.likes > currentFavorite.likes) {
      return {
        title: blog.title,
        author: blog.author,
        likes: blog.likes,
      }
    }
    return currentFavorite
  }, null)

  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogCounts = lodash.countBy(blogs, 'author')
  const mostBlogsAuthor = lodash.maxBy(Object.entries(blogCounts), ([, count]) => count)

  return {
    author: mostBlogsAuthor[0],
    blogs: mostBlogsAuthor[1],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likesByAuthor = {}

  blogs.forEach((blog) => {
    const author = blog.author
    const likes = blog.likes

    if (likesByAuthor[author]) {
      likesByAuthor[author] += likes
    } else {
      likesByAuthor[author] = likes
    }
  })

  const mostLikesAuthor = Object.entries(likesByAuthor).reduce(
    (maxLikesAuthor, [author, likes]) => {
      if (likes > maxLikesAuthor.likes) {
        return { author, likes }
      } else {
        return maxLikesAuthor
      }
    },
    { author: '', likes: 0 }
  )

  return mostLikesAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}