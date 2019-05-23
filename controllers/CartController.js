const boom = require('boom');
const Joi = require('joi');
// Get Data Models
const Cart = require('../models/Cart');
var _ = require('lodash');


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

        if(cart.customerId){
            var customerCart = await Cart.findOne(
                {"customerId":cart.customerId}).exec();
            if(customerCart){
                customerCart = this.combineCartItems(customerCart, cart);
                return await customerCart.save();
            }
            return await new Cart(cart).save();

        }else{
            return await new Cart(cart).save();
        }

    } catch (err) {
        throw boom.boomify(err);
    }
};

exports.combineCartItems = (existingCart, tempCart)=> {
    var itemsGroupedById = _.groupBy(_.concat(existingCart.itemsInCart, tempCart.itemsInCart),"customerId");
    var cartItems = [];
    _.forEach(_.values(itemsGroupedById), (group)=>{
        var qty = _.sumBy(group, 'quantity');
        group[0].quantity=qty;
        cartItems.push(group[0]);
    });

    existingCart.itemsInCart =cartItems;
    return existingCart;
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
        const tempCartId = req.params.id;
        const customerId = req.params.customerId;

        var existingCart = await Cart.findOne({customerId: customerId}).exec();

        //if customer has cart already combine the items in cart
        if(existingCart){
            const tempCart = await Cart.findOneAndDelete({_id:tempCartId, customerId: { "$exists" : false }}).exec();
            if(!tempCart){
                throw boom.boomify(new Error("The specified cart does not exist or already has customerId specified"));
            }
            existingCart = this.combineCartItems(existingCart, tempCart);
            return existingCart.save();

        }else{ //otherwise update the customer Id value on the cart specified if there isn't one already
            return temporaryCart = await Cart.findOneAndUpdate(
                { _id: tempCartId, customerId: { "$exists" : false }},
                { customerId: customerId}, {new:true}).exec();
            if(!temporaryCart){
                throw boom.boomify(new Error("Cart belongs to somebody else"));
            }
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



