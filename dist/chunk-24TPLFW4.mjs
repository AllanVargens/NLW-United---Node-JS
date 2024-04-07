import {
  BadRequest
} from "./chunk-UX6HP52O.mjs";

// src/error-handler/error-handler.ts
import { ZodError } from "zod";
var errorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: `Error validation`,
      erros: error.flatten().fieldErrors
    });
  }
  if (error instanceof BadRequest) {
    return reply.status(400).send({ message: error.message });
  }
  return reply.status(500).send({
    message: "Internal server error!"
  });
};

export {
  errorHandler
};
