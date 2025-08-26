import { FastifyPluginCallback } from 'fastify';
import { Piscina } from 'piscina';

type PiscinaOptions = NonNullable<ConstructorParameters<typeof Piscina>[0]>;

type FastifyPiscinaPluginType = FastifyPluginCallback<PiscinaOptions>;

declare module 'fastify' {
  interface FastifyInstance {
    piscina: fastifyPiscina.FastifyPiscinaPool;
    runTask: fastifyPiscina.FastifyPiscinaRunTask;
  }
}

declare namespace fastifyPiscina {
  export type FastifyPiscinaPool = Piscina;
  export type FastifyPiscinaRunTask = Piscina['run'];

  export type FastifyPiscinaPluginOptions = PiscinaOptions;

  export const fastifyPiscina: FastifyPiscinaPluginType;
  export { fastifyPiscina as default };
}

declare function fastifyPiscina(...params: Parameters<FastifyPiscinaPluginType>): ReturnType<FastifyPiscinaPluginType>;
export = fastifyPiscina;
