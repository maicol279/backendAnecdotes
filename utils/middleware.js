const { response } = require('express')
const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
  
}

const userExtractor = async (request, response, next) => {
try {
 // verifico que la cabezera 'authorization' exista y comience con "Bearer "
 const authorization = request.get('authorization');
 if (authorization && authorization.startsWith('Bearer ')) {
 // extraigo el token y lo verifico
   request.token = authorization.replace('Bearer ', '')
   const decodedToken = jwt.verify(request.token, process.env.SECRET)

   // verifico si el token decodificado contiene un id

   if(!decodedToken.id) {
     return response.status(401).json({ error: 'token missing or invalid'})
   }
   const user = await User.findById(decodedToken.id);

   if(!user) {
     return response.status(404).json({ error: 'user not found'})
   }
   request.user = user;
 }
 next();
} catch (error) {
  return response.status(500).json({ error: 'something went wrong' });
}
 
}

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}