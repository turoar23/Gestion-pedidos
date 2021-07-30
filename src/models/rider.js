const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const riderSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    vehicle:{
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Rider', riderSchema)