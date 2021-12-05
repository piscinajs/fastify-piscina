'use strict';

import { test } from 'tap';
import Fastify from 'fastify';
import fastifyPiscina from '../esm-wrapper.mjs';

test('It should add decorators - ESM', async (t) => {
  t.plan(3);

  const fastify = Fastify();
  await fastify.register(fastifyPiscina, {
    filename: new URL('./worker.mjs', import.meta.url).href
  });

  t.teardown(fastify.close.bind(fastify));

  t.ok(fastify.piscina);
  t.ok(fastify.piscina.run);
  t.ok(fastify.runTask);

  fastify.get('/', async (request, reply) => {
    reply.send({ result: await fastify.runTask({ a: 1, b: 2 }) });
  });

  await fastify.ready();
});

test('It should be able to use `fastify.runTask()` - ESM', async (t) => {
  t.plan(1);

  const fastify = Fastify();
  await fastify.register(fastifyPiscina, {
    filename: new URL('./worker.mjs', import.meta.url).href
  });

  t.teardown(fastify.close.bind(fastify));

  fastify.get('/', async (request, reply) => {
    reply.send({ result: await fastify.runTask({ a: 1, b: 2 }) });
  });

  await fastify.ready();

  const response = await fastify.inject({
    method: 'GET',
    path: '/'
  });
  const payload = JSON.parse(response.payload);
  t.equal(payload.result, 1);
});
