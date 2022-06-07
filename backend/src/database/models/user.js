const mongoose = require('mongoose')
const md5 = require('md5')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', function (next) {
    this.accessToken = md5(this.username + this.password + process.env.PASSWORD_SALT)
    next()
});

module.exports = mongoose.model('User', userSchema)