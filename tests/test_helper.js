const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'La vaquita',
        author: 'Alejandro dudamel',
        url: 'String'
    },
    {
        title: 'El bucaros',
        author: 'Alejandro garcia',
        url: 'String',
        likes: 5
    }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: "robert", url:"hola" })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }
  

  const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

  
  module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb
  }