import { FastifyPluginCallback } from 'fastify';
import Piscina from 'piscina';

type PiscinaOptions = typeof Piscina extends {
    new (options?: infer T): Piscina;
  }
  ? T
  : never;

export interface FastifyPiscinaPool extends Piscina {}

// Most importantly, use declaration merging to add the custom property to the Fastify type system
declare module "fastify" {
  interface FastifyInstance {
    piscina: FastifyPiscinaPool;
    runTask: FastifyPiscinaPool['runTask'];
  }
}

declare const fastifyPiscina: FastifyPluginCallback<PiscinaOptions>;
export default fastifyPiscina;
