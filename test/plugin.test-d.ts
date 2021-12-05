import path from 'path';
import Fastify from 'fastify';
import { expectError, expectType } from 'tsd';
import piscinaPlugin, { FastifyPiscinaPool } from '../../plugin';

const app = Fastify();

app.register(piscinaPlugin, {
  filename: path.join(__dirname, 'worker.js')
});

app.get('/', async (request, reply) => {
  return { hello: `world [${await app.runTask({ a: 1, b: 2 })}]` };
});

app.after(() => {
  expectType<FastifyPiscinaPool>(app.piscina);
  expectType<FastifyPiscinaPool['run']>(app.runTask);
});

const appThatTriggersTypescriptErrors = Fastify();

expectError(
  appThatTriggersTypescriptErrors.register(piscinaPlugin, {
    unknownOption: 'I will trigger a typescript error'
  })
)
