import path from 'path';
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { expectError, expectType } from 'tsd';
import piscinaPlugin, { FastifyPiscinaPool } from '../../plugin';

const app: FastifyInstance = Fastify();

app.register(piscinaPlugin, {
  filename: path.join(__dirname, 'worker.js'),
});

// Tsd complains for no reason
// @ts-ignore
app.get('/', async (_request: FastifyRequest, _reply: FastifyReply) => {
  return { hello: `world [${await app.runTask({ a: 1, b: 2 })}]` };
});

app.ready(() => {
  expectType<FastifyPiscinaPool>(app.piscina);
  expectType<FastifyPiscinaPool['run']>(app.runTask);
});

const appThatTriggersTypescriptErrors = Fastify();

expectError(
  appThatTriggersTypescriptErrors.register(piscinaPlugin, {
    unknownOption: 'I will trigger a typescript error',
  })
);
