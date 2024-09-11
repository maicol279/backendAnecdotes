const { test, after, beforeEach, describe } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcryptjs')

const helper = require('./test_helper')

const Blog =  require('../models/blog')
const User = require('../models/user')


beforeEach(async() => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject =  new Blog(helper.initialBlogs[1])
    await blogObject.save()
})


// test('blogs are returned as json', async () => {
//     const response = await api.get('/api/blogs')
//     console.log('this is ' ,response.body[0])
//     assert.strictEqual(response.body.length, 2)
// })


// test('blogs have id property', async () => {
//     const response = await api.get('/api/blogs')
//     const contents = response.body.map(r => r.id)
//     console.log(contents)
//     assert.strictEqual(response.body.length, contents.length)
// })

// test('check if the property likes is defined', async() => {
//     const newBlog = {
//         title: 'Bucaros campeon',
//         author: 'dudamel',
//         url: 'String'
//     }

    
//     const response = await api
//     .post('/api/blogs')
//     .send(newBlog)
//     .expect(201)
//     .expect('Content-Type', /application\/json/)


//     // Verifica que la respuesta tenga la propiedad likes con valor 0
//     assert.strictEqual(response.body.likes, 0)

//     const blogsAtEnd = await helper.blogsInDb()
//     const savedBlog = blogsAtEnd.find(blog => blog.title === 'Bucaros campeon')

//     assert.strictEqual(savedBlog.likes, 0)
// })

// test('a valid blog can be added', async () => {
//     const newBlog = {
//         title: 'The blog',
//         author: 'Alberto Gamero',
//         url: 'String',
//         likes: 7
//     }

//     await api
//     .post('/api/blogs')
//     .send(newBlog)
//     .expect(201)
//     .expect('Content-Type', /application\/json/)

//     const blogsAtEnd = await helper.blogsInDb()
//     assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
// })


// test('title or url is not defined', async() => {
//     const newBlogWithoutTitle = {
//         author: 'Author',
//         url: 'http://example.com',
//         likes: 5
//     }

//     const newBlogWithoutUrl = {
//         title: 'No URL Blog',
//         author: 'Author',
//         likes: 5
//     }

//     await api
//     .post('/api/blogs')
//     .send(newBlogWithoutTitle)
//     .expect(400)

//     await api
//     .post('/api/blogs')
//     .send(newBlogWithoutUrl)
//     .expect(400)
// })



describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test("creation fails with proper statuscode and message if username already taken", async () => {

    const usersAtStart = await helper.usersInDb()
    
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    
    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('adding a blog without a valid token returns the status code 401 unauthorized', () => {
  test('fails with status code 401 if no token is provided', async () => {
    const newBlog = {
      title: 'Unauthorized Test Blog',
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 5
    }

    const result = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'Invalid or missing token');
  })
})
after(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
  })