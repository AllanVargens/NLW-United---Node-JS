import {
  BadRequest
} from "./chunk-UX6HP52O.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-attendee-badge.ts
import { z } from "zod";
async function getAttendeeBadge(app) {
  app.withTypeProvider().get(
    "/attendee/:attendeeId/badge",
    {
      schema: {
        summary: "Get an attendee badge",
        tags: ["attendee"],
        params: z.object({
          attendeeId: z.coerce.number().int()
          // coerce transforma string em number
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string().email(),
              event: z.string(),
              checkInURL: z.string().url()
            })
          })
        }
      }
    },
    async (require2, reply) => {
      const { attendeeId } = require2.params;
      const attendee = await prisma.attendee.findUnique({
        where: {
          id: attendeeId
        },
        select: {
          name: true,
          email: true,
          event: {
            // inner join possivel por conta da relação no model
            select: {
              title: true
            }
          }
        }
      });
      if (attendee == null) {
        throw new BadRequest("Attendee not found");
      }
      const baseURL = `${require2.protocol}://${require2.hostname}`;
      const checkInURL = new URL(`attendees/${attendeeId}/check-in`, baseURL);
      return reply.send({
        badge: {
          name: attendee.name,
          email: attendee.email,
          event: attendee.event.title,
          checkInURL: checkInURL.toString()
        }
      });
    }
  );
}

export {
  getAttendeeBadge
};
