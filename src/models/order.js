const moogose = require('mongoose');
const Schema = moogose.Schema;

const orderSchema = new Schema({
    gloriaId: {
        type: Number,
        required: false
    },
    client: {
        type: Object,
        required: true
    },
    address: {
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
    payment: {
        type: String,
        required: true,
        default: null
    },
    status: {
        type: String,
        required: true,
        default: 'Completed' // Can be: Active, Canceled, Completed
    },
    // rider: {
    //     name:{
    //         type: String
    //     },
    rider: {
        type: Schema.Types.ObjectId,
        ref: 'Rider'
        // }
    }
})

module.exports = moogose.model('Order', orderSchema)