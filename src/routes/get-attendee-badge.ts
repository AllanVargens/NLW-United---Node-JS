import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { request } from "http";
import { BadRequest } from "../_errors/bad-request";

export async function getAttendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendee/:attendeeId/badge",
    {
      schema: {
        summary: "Get an attendee badge",
        tags: ["attendee"],
        params: z.object({
          attendeeId: z.coerce.number().int(), // coerce transforma string em number
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string().email(),
              event: z.string(),
              checkInURL: z.string().url(),
            }),
          }),
        },
      },
    },
    async (require, reply) => {
      const { attendeeId } = require.params;
      const attendee = await prisma.attendee.findUnique({
        where: {
          id: attendeeId,
        },
        select: {
          name: true,
          email: true,
          event: {
            // inner join possivel por conta da relação no model
            select: {
              title: true,
            },
          },
        },
      });

      if (attendee == null) {
        throw new BadRequest("Attendee not found");
      }

      const baseURL = `${require.protocol}://${require.hostname}`;
      const checkInURL = new URL(`attendees/${attendeeId}/check-in`, baseURL);

      return reply.send({
        badge: {
          name: attendee.name,
          email: attendee.email,
          event: attendee.event.title,
          checkInURL: checkInURL.toString(),
        },
      });
    }
  );
}
