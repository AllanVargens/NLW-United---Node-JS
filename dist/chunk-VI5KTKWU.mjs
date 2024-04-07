import {
  generateSlug
} from "./chunk-LEIRQMU3.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/create_event.ts
import z from "zod";
async function createEvent(app) {
  app.withTypeProvider().post(
    // atraves do zod-type-provider se consegue validar as coisas que vem do body
    "/events",
    {
      schema: {
        summary: "Create an event",
        tags: ["events"],
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable()
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid()
            // garante que o retorno da funcao sera exatamente esse formato quando a resposta for 201
          })
        }
      }
    },
    async (request, reply) => {
      const data = request.body;
      const slug = generateSlug(data.title);
      const eventWitfSameSlug = await prisma.event.findUnique({
        where: { slug }
      });
      if (eventWitfSameSlug !== null) {
        throw new Error("Another event with same title already exists");
      }
      const event = await prisma.event.create({
        data: {
          title: data.title,
          details: data.details,
          maximumAttendees: data.maximumAttendees,
          slug
        }
      });
      return reply.status(201).send({ eventId: event.id });
    }
  );
}

export {
  createEvent
};
