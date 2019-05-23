const cartController = require('../controllers/CartController');

const routes = [

    {
        method: 'GET',
        url: '/api/cart/:id',
        handler: cartController.getCart
    },
    {
        method: 'POST',
        url: '/api/cart',
        handler: cartController.createCart
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
    }

];

module.exports = routes;

// ,
// {
//     method: 'PUT',
//         url: '/api/cart/:id',
//     handler: cartController.updateCart
// }
//
// {
//     method: 'GET',
//         url: '/api/cart/:id',
//     handler: cartController.getCart
// },