const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true,
    },
    tags: [{
        type: String
    }],
    usefulness: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        }
    }],
    averageRating: {
        type: Number, 
        default: 0
    }
});

materialSchema.methods.calculateAverageRating = function() {
    if (this.usefulness.length > 0) {
        const sum = this.usefulness.reduce((acc, curr) => acc + curr.rating, 0);
        this.averageRating = sum / this.usefulness.length;
    } else {
        this.averageRating = 0;
    }
    return this.averageRating;
};

module.exports = mongoose.model('Material', materialSchema);
