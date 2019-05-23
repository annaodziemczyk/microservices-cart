const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    catalogueId: String,
    name: String,
    quantity: Number,
    price: Number
});

const cartSchema = new mongoose.Schema({
    customerId: {
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