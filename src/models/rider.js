const moogose = require('mongoose');
const Schema = moogose.Schema;

const riderSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    vehicle:{
        type: String,
        required: true
    }
})

module.exports = moogose.model('Rider', riderSchema)