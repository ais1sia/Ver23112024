const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    level: {
        type: String,
        default: "beginner"
    },
    roles: [{
        type: String,
        default: "User"
    }],
    goals: [{
        type: String,
        default: "general"
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    progress: [{
        materialId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Material',
            required: true
        },
        completedAt: {
            type: Date,
            default: Date.now
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        }
    }],
});

module.exports = mongoose.model('User', userSchema);
