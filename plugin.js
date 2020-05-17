'use strict';

const fp = require('fastify-plugin');
const Piscina = require('piscina');
const { name, version } = require('./package.json');

function piscinaPlugin (fastify, options, next) {
  const pool = new Piscina(options);
  fastify.decorate('piscina', pool);
  fastify.decorate('runTask', (...args) => pool.runTask(...args));
  next();
}

module.exports = fp(piscinaPlugin, {
  fastify: '>=1.0.0',
  name,
  version
});
