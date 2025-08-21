'use strict';

const fp = require('fastify-plugin');
const Piscina = require('piscina');
const { name } = require('./package.json');

function fastifyPiscina (fastify, options, next) {
  if (fastify.piscina || fastify.runTask) {
    return next(new Error('fastify-piscina has already been registered'));
  }

  const pool = new Piscina(options);

  fastify.decorate('piscina', pool);
  fastify.decorate('runTask', (...args) => pool.run(...args));

  next();
}

const plugin = fp(fastifyPiscina, {
  fastify: '5.x',
  name
});

module.exports = plugin;
module.exports.default = plugin;
module.exports.fastifyPiscina = plugin;
