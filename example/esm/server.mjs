import { fastify } from 'fastify';
import * as fastifyPiscina from '../../esm-wrapper.mjs';

const app = fastify({ logger: true });

app.register(fastifyPiscina, {
  // Piscina constructor options
  filename: new URL('./worker.mjs', import.meta.url).href
});

app.get('/', async (request, reply) => {
  reply.send({ hello: `world [${await app.runTask({ a: 1, b: 2 })}]` });
});

// Run the server!
app.listen(3000, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});
