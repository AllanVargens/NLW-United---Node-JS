import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "../_errors/bad-request";

export async function registerForEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: "register an attendee",
        tags: ["attendees"],
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            attendeeId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const { name, email } = request.body;

      const attendeeFromEmail = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            email,
            eventId,
          },
        },
      });

      if (attendeeFromEmail !== null) {
        throw new BadRequest("This email is already resgistred for this event");
      }

      const [event, amountOfAttendeesForEvent] = await Promise.all([
        // promise.all usado quando duas coisas podem acontecer idenepedente da outra.
        prisma.event.findUnique({
          where: {
            id: eventId,
          },
        }),
        prisma.attendee.count({
          where: {
            eventId,
          },
        }),
      ]);

      if (
        event?.maximumAttendees &&
        amountOfAttendeesForEvent >= event.maximumAttendees
      ) {
        //verificacao de numero maximo de participantes
        throw new BadRequest(
          "This event has reached the maximum number of attendees"
        );
      }

      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId,
        },
      });
      return reply.status(201).send({ attendeeId: attendee.id });
    }
  );
}
