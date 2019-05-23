const boom = require('boom');
const Joi = require('joi');
// Get Data Models
const Cart = require('../models/Cart');


const productSchema = Joi.object({
    catalogueId:Joi.string().required(),
    name: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required().min(1)
});

const cartProductSchema= Joi.object({
    catalogueId:Joi.string().required(),
    quantity: Joi.number().required().min(1)
});

const cartSchema = Joi.object({
    customerId: Joi.string(),
    itemsInCart: Joi.array().min(1).items(productSchema)
});

// get cart
exports.getCart = async (req, reply) => {
    try {
        const id = req.params.id;
        return await Cart.findById(id);

    } catch (err) {
        throw boom.boomify(err);
    }
};

// create cart
exports.createCart = async (req, reply) => {
    try {
        let cart = await Joi.validate(req.body, cartSchema, { abortEarly: false });
        return await new Cart(cart).save();

    } catch (err) {
        throw boom.boomify(err);
    }
};

exports.addItem = async (req, reply) => {
    try {
        const id = req.params.id;
        const product = await Joi.validate(req.body, productSchema, { abortEarly: false});
        var cart = await Cart.findOneAndUpdate(
            {"_id":id, "itemsInCart.catalogueId": product.catalogueId},
            {$inc : {'itemsInCart.$.quantity' : product.quantity}},
            {new:true}).exec();
        if(!cart){
            cart = await Cart.findOneAndUpdate(
                { _id: id },
                { $push: { itemsInCart: product } },
                {new:true}).exec();
        }
        return cart;
    } catch (err) {
        throw boom.boomify(err);
    }
};

exports.removeItem = async (req, reply) => {
    try {
        const product = await Joi.validate(req.body, cartProductSchema, { abortEarly: false});
        const id = req.params.id;

        var cart = await Cart.findOneAndUpdate(
            {"_id":id, "itemsInCart.catalogueId": product.catalogueId},
            {$inc : {'itemsInCart.$.quantity' : - product.quantity}},
            {new:true}).exec();

        cart = await Cart.findOneAndUpdate(
            { _id: id },
            { $pull: {itemsInCart: { "quantity": {$lt:1}}}}, {new:true, multi:true}).exec();

        return cart;

    } catch (err) {
        throw boom.boomify(err);
    }
};

exports.combineCustomerCarts = async (req, reply) => {
    try {
        const tempCartId = req.params.cartId;
        const customerId = req.params.customerId;
        var query = {customerId: customerId};
        const cart = await Cart.findOne(query);

        if(cart){
            const tempCart = await Product.findByIdAndDelete(tempCartId).populate('itemsInCart');
            Cart.updateOne(
                { _id: cart._id },
                { $push: { itemsInCart: tempCart.itemsInCart } }
            );

        }else{
            Cart.updateOne(
                { _id: tempCartId },
                { customerId: tempCart.customerId }
            );
            tempCart.customerId = customerId;
            return tempCart.save();
        }

    } catch (err) {
        throw boom.boomify(err);
    }
};

// Delete a user
exports.deleteCart = async (req, reply) => {
    try {
        const id = req.params.id;
        const cart = await Cart.findByIdAndRemove(id);
        return cart;
    } catch (err) {
        throw boom.boomify(err);
    }
};

exports.getCartById = function(id, callback){
    Cart.findById(id, callback);
};



