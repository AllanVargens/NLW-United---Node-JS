import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/check-in.ts
import { z } from "zod";
async function CheckIn(app) {
  app.withTypeProvider().get(
    "/attendees/:attendeeId/check-in",
    {
      schema: {
        summary: "Realize a check-in",
        tags: ["attendee"],
        params: z.object({
          attendeeId: z.coerce.number().int()
        }),
        response: {
          201: z.null()
        }
      }
    },
    async (request, reply) => {
      const { attendeeId } = request.params;
      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          attendeeId
        }
      });
      if (attendeeCheckIn !== null) {
        throw new Error("Attendee already checked in");
      }
      await prisma.checkIn.create({
        data: {
          attendeeId
        }
      });
      return reply.status(200).send();
    }
  );
}

export {
  CheckIn
};
