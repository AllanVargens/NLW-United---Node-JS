import {
  errorHandler
} from "./chunk-24TPLFW4.mjs";
import {
  CheckIn
} from "./chunk-ZZEPQVF3.mjs";
import {
  createEvent
} from "./chunk-VI5KTKWU.mjs";
import "./chunk-LEIRQMU3.mjs";
import {
  getAttendeeBadge
} from "./chunk-EZBJVLGJ.mjs";
import {
  getEventAteendes
} from "./chunk-M4DPQW2S.mjs";
import {
  getEvent
} from "./chunk-IBYNMGC5.mjs";
import {
  registerForEvent
} from "./chunk-SYWIOMJP.mjs";
import "./chunk-UX6HP52O.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastfy from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastifyCors } from "@fastify/cors";
var app = fastfy();
app.register(fastifyCors, {
  origin: "*"
  // qualquer url pode acessar a sua api, em prod, é bom colocar apenas a url do front
});
app.register(fastifySwagger, {
  // documentacao
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass.in",
      description: "especificacoes da api usada para o backend da aplicacao pass.in construida durante a NLW United da RockeatSeat",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
  // como o swagger deve enteder os schemas de rotas, no caso do api, o zod
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(CheckIn);
app.register(getEventAteendes);
app.setErrorHandler(errorHandler);
app.listen({
  host: "0.0.0.0",
  port: 3e3
}).then(() => console.log("listening on port"));
