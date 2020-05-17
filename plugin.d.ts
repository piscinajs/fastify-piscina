export import Piscina from 'piscina';
import { MessagePort } from 'node';

type TransferList = MessagePort extends { postMessage(value : any, transferList : infer T) : any; } ? T : never;

interface AbortSignalEventTarget {
  addEventListener : (name : 'abort', listener : () => void) => void;
}
interface AbortSignalEventEmitter {
  on : (name : 'abort', listener : () => void) => void;
}
type AbortSignalAny = AbortSignalEventTarget | AbortSignalEventEmitter;

type RunTaskFunction = (
  task : any,
  transferList : TransferList,
  filename : string | null,
  abortSignal : AbortSignalAny | null) => Promise<any>;

export type PiscinaOptions = typeof Piscina extends {
  new (options? : infer T) : Piscina
} ? T : never;

// Most importantly, use declaration merging to add the custom property to the Fastify type system
declare module 'fastify' {
  interface FastifyIntstance {
    piscina: Piscina,
    runTask: RunTaskFunction
  }
 }
