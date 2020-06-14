# fastify-piscina - A Piscina plugin for Fastify

## Example

```js
const fastify = require('fastify')();
const { resolve} = require('path');

fastify.register(require('fastify-piscina'), {
  // Piscina Options object. See Piscina docs for details
  filename: resolve(__dirname, 'worker.js')
});

// Declare a route
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
```

Once registered, the plugin decorates the `fastify` instance
with two new properties:

* `fastify.piscina` {`Piscina`} The Piscina instance.
* `fastify.runTask()` {`Function`} The Piscina runTask function.

See the [Piscina docs][] for more information.

## The Team

* James M Snell <jasnell@gmail.com>
* Anna Henningsen <anna@addaleax.net>
* Matteo Collina <matteo.collina@gmail.com>

## Acknowledgements

Piscina development is sponsored by [NearForm Research][].

[Piscina docs]: https://github.com/jasnell/piscina
[NearForm Research]: https://www.nearform.com/research/
