import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { generateSlug } from "../utils/generate_slug";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";

//para usar o app necessita-se exportado dessa forma, dentro de uma funcao, e registrar essa funcao la no server.ts
export async function createEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    // atraves do zod-type-provider se consegue validar as coisas que vem do body
    "/events",
    {
      schema: {
        summary: "Create an event",
        tags: ["events"],
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(), // garante que o retorno da funcao sera exatamente esse formato quando a resposta for 201
          }),
        },
      },
    },
    async (request, reply) => {
      const data = request.body;

      const slug = generateSlug(data.title);
      const eventWitfSameSlug = await prisma.event.findUnique({
        where: { slug },
      });

      if (eventWitfSameSlug !== null) {
        throw new Error("Another event with same title already exists");
      }

      const event = await prisma.event.create({
        data: {
          title: data.title,
          details: data.details,
          maximumAttendees: data.maximumAttendees,
          slug,
        },
      });

      return reply.status(201).send({ eventId: event.id });
    }
  );
}
