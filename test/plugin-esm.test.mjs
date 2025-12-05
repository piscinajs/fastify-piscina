'use strict';

import { test } from 'node:test';
import assert from 'node:assert';
import Fastify from 'fastify';
import fastifyPiscina from '../plugin.js';

test('It should add decorators - ESM', async (t) => {
  const fastify = Fastify();
  await fastify.register(fastifyPiscina, {
    filename: new URL('./worker.mjs', import.meta.url).href
  });

  t.after(() => fastify.close());

  assert.ok(fastify.piscina);
  assert.ok(fastify.piscina.run);
  assert.ok(fastify.runTask);

  fastify.get('/', async (request, reply) => {
    reply.send({ result: await fastify.runTask({ a: 1, b: 2 }) });
  });

  await fastify.ready();
});

test('It should throw when trying to register the plugin more than once - ESM', async () => {
  const fastify = Fastify();
  fastify.register(fastifyPiscina).register(fastifyPiscina);

  await assert.rejects(
    fastify.ready(),
    { message: 'fastify-piscina has already been registered' }
  );
});

test('It should be able to use `fastify.runTask()` - ESM', async (t) => {
  const fastify = Fastify();
  await fastify.register(fastifyPiscina, {
    filename: new URL('./worker.mjs', import.meta.url).href
  });

  t.after(() => fastify.close());

  fastify.get('/', async (request, reply) => {
    reply.send({ result: await fastify.runTask({ a: 1, b: 2 }) });
  });

  await fastify.ready();

  const response = await fastify.inject({
    method: 'GET',
    path: '/'
  });
  const payload = JSON.parse(response.payload);
  assert.strictEqual(payload.result, 1);
});
