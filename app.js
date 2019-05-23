const mongoose = require('mongoose');
const routes = require('./routes');
// Import Swagger Options
const swagger = require('./config/swagger');

const fastify = require('fastify')({
    logger: true
});


if(process.env.MONGO_PASS==undefined){
    throw Error("MongoDB password not set");
}else {
    const db = 'mongodb+srv://admin:' + (process.env.MONGO_PASS).trim() + '@cart-k7dk7.gcp.mongodb.net/test?retryWrites=true';
    const local_db = 'mongodb://localhost/cart';

// Connect to DB
    mongoose.connect(db)
        .then(() => {
                console.log('MongoDB connected…');
                // Run the server!
                const start = async () => {
                    // Register Swagger
                    fastify.register(require('fastify-swagger'), swagger.options);

                    try {
                        routes.forEach((route, index) => {
                            fastify.route(route)
                        });

                        await fastify.listen(3003, '0.0.0.0', function (err, address) {
                            if (err) {
                                fastify.log.error(err);
                                process.exit(1)
                            }
                            fastify.swagger();
                            fastify.log.info(`server listening on ${fastify.server.address().port}`);
                        });

                    } catch (err) {
                        fastify.log.error(err);
                        process.exit(1)
                    }
                };
                start();
            }
        )
        .catch(err => console.log(err));
}
