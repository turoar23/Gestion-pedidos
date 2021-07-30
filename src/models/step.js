const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stepSchema = new Schema({
    steps: [String]
})

module.exports = mongoose.model('Step', stepSchema)