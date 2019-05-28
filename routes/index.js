const cartController = require('../controllers/CartController');

const routes = [

    {
        method: 'GET',
        url: '/api/cart/:id',
        handler: cartController.getCart
    },
    {
        method: 'GET',
        url: '/api/cart/user/:id',
        handler: cartController.getUserCart
    },
    {
        method: 'POST',
        url: '/api/cart',
        handler: cartController.createCart
    },
    {
        method: 'GET',
        url: '/api/cart/:id/combine/:userId',
        handler: cartController.combineCustomerCarts
    },
    {
        method: 'PUT',
        url: '/api/cart/:id/addItem',
        handler: cartController.addItem
    },
    {
        method: 'PUT',
        url: '/api/cart/:id/removeItem',
        handler: cartController.removeItem
    },
    {
        method: 'DELETE',
        url: '/api/cart/:id',
        handler: cartController.deleteCart
    }

];

module.exports = routes;
