// en el controlador van las rutas
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

const middleware = require('../utils/middleware')
const { response, request } = require('express')

// aislar token 
// const getTokenFrom = request => {
//     const authorization = request.get('authorization')
//     if (authorization && authorization.startsWith('Bearer ')) {
//       return authorization.replace('Bearer ', '')
//     }
//     return null
//   }

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {

    try {
        const {title, url, author, likes } = request.body


        if(!title || !url)  {
            return response.status(400).json({error: 'title or url missing'})
        }
    
        const user = request.user;
console.log('el user es ',user)
        if(!user) {
            return response.status(401).json({ error: 'Invalid or missing token' });
        }
    
        const blog = new Blog({
            title,
            author,
            url,
            likes: likes || 0,
            user: user._id,
        });
       
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
    
        response.status(201).json(savedBlog) 
    } catch  (error) {
        console.error(error); // Para depuración, puede removerse en producción
        response.status(500).json({ error: 'An error occurred while creating the blog' });
      }

})

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
    
    response.json(blogs)
})

// get one


blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

try {
    const user = request.user;
    const blogId = request.params.id;

    console.log('el user es', user)
    console.log('el blog es', blogId)
    // busco el blog por id

    if (!blogId) {
        return response.status(400).json({ error: 'blog id is missing' })
    }

    const blog = await Blog.findById(blogId)
    if(!blog) {
        return response.status(404).json({ error: 'blog not found' });
    }

    if(!user) {
        return response.status(404).json({ error: 'unauthorized' });
    }

    // valido si el usuario es propietario del blog
    if(blog.user.toString() !== user.id.toString()){
        return response.status(403).json({ error: 'forbidden' });
    }
    // Eliminar el blog
        await Blog.findByIdAndDelete(blogId);
        response.status(204).end()
} catch (error) {
    console.error(error);
    response.status(500).json({ error: 'An error occurred while deleting the blog' });
}
   

 
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body;
  
    const updatedBlog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: body.user,
      comments: body.comments
    };
  
    try {
      const blog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true }).populate('user', { username: 1, name: 1 });;
      response.status(200).json(blog);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'An error occurred while updating the blog.' });
    }
  });

  //comentarios

  blogsRouter.post('/:id/comments', async (request, response) => {
    const { comment } = request.body;
    const blogId = request.params.id;
  
    if (!comment) {
      return response.status(400).json({ error: 'Comment is required' });
    }
  
    try {
      const blog = await Blog.findById(blogId);
  
      if (!blog) {
        return response.status(404).json({ error: 'Blog not found' });
      }
  
      blog.comments = blog.comments.concat(comment);
      const updatedBlog = await blog.save();
      response.status(200).json(updatedBlog);
    } catch (error) {
      console.error('Error adding comment:', error);
      response.status(500).json({ error: 'An error occurred while adding the comment' });
    }
  });
  
  
  module.exports = blogsRouter;