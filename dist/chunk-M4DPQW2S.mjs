import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-event-attendes.ts
import z from "zod";
async function getEventAteendes(app) {
  app.withTypeProvider().get(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: "Get all attendes from event",
        tags: ["events"],
        params: z.object({
          eventId: z.string().uuid()
        }),
        querystring: z.object({
          query: z.string().nullish(),
          // nullish usadado quando poder ser tanto quando undefiened quanto null
          pageIndex: z.string().nullish().default("0").transform(Number)
        }),
        response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number(),
                nome: z.string(),
                email: z.string().email(),
                createdAt: z.date(),
                checkedInAt: z.date().nullable()
              })
            )
          })
        }
      }
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const { pageIndex, query } = request.query;
      const attendees = await prisma.attendee.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          CheckIn: {
            select: {
              createdAt: true
              // dentro do checkin agora a data do mesmo esta sendo passada
            }
          }
        },
        where: query ? {
          eventId,
          name: {
            contains: query
          }
        } : {
          eventId
        },
        take: 10,
        skip: pageIndex * 10,
        // quando em 0(primeira pag) ele n vai pular nenhum e vai mostrar os primeiros 10, quando tiver na pagina 2(pageIndex = 1), vai pular 10
        orderBy: {
          createdAt: "desc"
        }
      });
      return reply.send({
        attendees: attendees.map((attendee) => {
          return {
            id: attendee.id,
            nome: attendee.name,
            email: attendee.email,
            createdAt: attendee.createdAt,
            checkedInAt: attendee.CheckIn?.createdAt ?? null
            // attendee.checkIn ? attendee.CheckIn.createdAt : null
          };
        })
      });
    }
  );
}

export {
  getEventAteendes
};
