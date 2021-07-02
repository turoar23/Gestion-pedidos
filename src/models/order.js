const moogose = require('mongoose');
const Schema = moogose.Schema;

const orderSchema = new Schema({
    gloriaId: {
        type: Number,
        required: true
    },
    client: {
        type: Object,
        required: true
    },
    address:{
        type: Object,
        required: true
    },
    restaurant: {
        type: String,
        required: true
    },
    times: [{
        _id: false,
        by: {
            type: Number,
            required: true,
        },
        action: {
            type: String,
            required: true
        }
    }],
    // rider: {
    //     name:{
    //         type: String,
    //         required: true
    //     },
    //     userId: {
    //         type: Schema.Types.ObjectId,
    //         required: true,
    //         ref: 'Rider'
    //     }
    // }
})

module.exports = moogose.model('Order', orderSchema)