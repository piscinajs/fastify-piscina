import Piscina from "piscina";
import { Plugin } from "fastify";
import { ServerResponse, IncomingMessage, Server } from "http";
import { Http2Server, Http2ServerRequest, Http2ServerResponse } from "http2";

type HttpServer = Server | Http2Server;
type HttpRequest = IncomingMessage | Http2ServerRequest;
type HttpResponse = ServerResponse | Http2ServerResponse;

type PiscinaOptions = typeof Piscina extends {
  new (options?: infer T): Piscina;
}
  ? T
  : never;

interface PiscinaPlugin
  extends Plugin<HttpServer, HttpRequest, HttpResponse, PiscinaOptions> {}

declare const piscinaPlugin: PiscinaPlugin;
export = piscinaPlugin;

// Most importantly, use declaration merging to add the custom property to the Fastify type system
declare module "fastify" {
  interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse
  > {
    piscina: Piscina;
    runTask: Piscina["runTask"];
  }
}
