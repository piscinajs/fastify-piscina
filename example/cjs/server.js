const fastify = require('fastify')({
  logger: true
});

const fastifyPiscina = require('../..');
const { resolve } = require('path');

fastify.register(fastifyPiscina, {
  // Piscina constructor options
  filename: resolve(__dirname, 'worker.js')
});

fastify.get('/', async (request, reply) => {
  reply.send({ hello: `world [${await fastify.runTask({ a: 1, b: 2 })}]` });
});

// Run the server!
fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
