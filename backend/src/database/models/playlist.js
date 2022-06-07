const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['private', 'public'],
        required: true
    },
    songs: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Song',
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Playlist', playlistSchema)