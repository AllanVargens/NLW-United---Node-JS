import fastfy from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createEvent } from "./routes/create_event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { CheckIn } from "./routes/check-in";
import { getEventAteendes } from "./routes/get-event-attendes";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastifyCors } from "@fastify/cors";
import { errorHandler } from "./error-handler/error-handler";

const app = fastfy();

app.register(fastifyCors, {
  origin: "*", // qualquer url pode acessar a sua api, em prod, é bom colocar apenas a url do front
});

app.register(fastifySwagger, {
  // documentacao
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass.in",
      description:
        "especificacoes da api usada para o backend da aplicacao pass.in construida durante a NLW United da RockeatSeat",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform, // como o swagger deve enteder os schemas de rotas, no caso do api, o zod
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// call routes

app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(CheckIn);
app.register(getEventAteendes);

app.setErrorHandler(errorHandler);

app
  .listen({
    host: "0.0.0.0",
    port: 3000,
  })
  .then(() => console.log("server initialized"));
