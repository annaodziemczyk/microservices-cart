const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    catalogueId: {
        type:String,
        required: true
    },
    name: {
        type:String,
        required: true
    },
    quantity: {
        type:Number,
        required: true
    },
    price: {
        type:Number,
        required: true
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: false
    },
    itemsInCart: [
        productSchema
    ],
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    },
}, {
    versionKey: false,
    usePushEach:true
});

module.exports = mongoose.model('Cart', cartSchema);