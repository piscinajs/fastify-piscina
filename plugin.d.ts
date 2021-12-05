import Piscina from 'piscina';
import { FastifyPluginCallback } from 'fastify';

type PiscinaOptions = typeof Piscina extends {
    new (options?: infer T): Piscina;
  }
  ? T
  : never;

// Most importantly, use declaration merging to add the custom property to the Fastify type system
declare module "fastify" {
  interface FastifyInstance {
    piscina: Piscina;
    runTask: Piscina['run'];
  }
}

declare const fastifyPiscina: FastifyPluginCallback<PiscinaOptions>;
export default fastifyPiscina;
