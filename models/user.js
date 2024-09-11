const mongoose = require('mongoose')

//esquema
const userSchema = mongoose.Schema({
    username: {
        type: String, 
        required: true,
        unique: true,
        minLength: 3
    },
    name: {
        type: String,
        minLength: 3
    },
    passwordHash: {
        type: String,
        minLength:3
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

//set
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)