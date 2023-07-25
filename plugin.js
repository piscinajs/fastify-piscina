'use strict';

const fp = require('fastify-plugin');
const Piscina = require('piscina');
const { name, version } = require('./package.json');

function piscinaPlugin (fastify, options, next) {
  if (fastify.piscina || fastify.runTask) {
    return next(new Error('fastify-piscina has already been registered'));
  }

  const pool = new Piscina(options);

  fastify.decorate('piscina', pool);
  fastify.decorate('runTask', (...args) => pool.run(...args));

  next();
}

module.exports = fp(piscinaPlugin, {
  fastify: '>=1.0.0',
  name,
  version
});
