'use strict';

const { resolve } = require('path');
const { test } = require('node:test');
const assert = require('node:assert');
const Fastify = require('fastify');
const fastifyPiscina = require('../plugin');

test('It should add decorators - CommonJS', async (t) => {
  const fastify = Fastify();
  await fastify.register(fastifyPiscina, {
    filename: resolve(__dirname, 'worker.js')
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

test('It should throw when trying to register the plugin more than once - CommonJS', async () => {
  const fastify = Fastify();
  fastify
    .register(fastifyPiscina)
    .register(fastifyPiscina);

  await assert.rejects(
    fastify.ready(),
    { message: 'fastify-piscina has already been registered' }
  );
});

test('It should be able to use `fastify.runTask()` - CommonJS', async (t) => {
  const fastify = Fastify();
  await fastify.register(fastifyPiscina, {
    filename: resolve(__dirname, 'worker.js')
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
  assert.strictEqual(payload.result, 3);
});
