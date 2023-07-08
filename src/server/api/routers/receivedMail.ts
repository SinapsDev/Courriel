import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const receivedMailRouter = createTRPCRouter({
  getTotal: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.receivedMail.count();
  }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.receivedMail.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  getByFilter: protectedProcedure
    .input(
      z.object({
        object: z.string().optional(),
        sender: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.receivedMail.findMany({
        where: {
          object: {
            contains: input.object,
          },
          date: {
            gte: input.startDate ? new Date(input.startDate) : new Date(0),
            lte: input.endDate ? new Date(input.endDate) : new Date(),
          },
          sender: {
            contains: input.sender,
          },
        },
      });
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        skip: z.number(),
        take: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.receivedMail.findMany({
        take: input.take,
        skip: input.skip,
        orderBy: {
          date: "desc",
        },
      });
    }),

  getNumberOfMailsInDetailsForToday: protectedProcedure.query(({ ctx }) => {
    // TODO: get total number all mails and important mails for today and this week
    return ctx.prisma.receivedMail
      .count({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(),
          },
        },
      })
      .then((res) => {
        return ctx.prisma.receivedMail
          .count({
            where: {
              date: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lte: new Date(),
              },
              importance: "IMPORTANT",
            },
          })
          .then((res2) => {
            return {
              total: res,
              important: res2,
            };
          });
      })
      .catch((err: string) => {
        throw new TRPCError({ message: err, code: "INTERNAL_SERVER_ERROR" });
      });
  }),

  getNumberOfMailsInDetailsForThisWeek: protectedProcedure.query(({ ctx }) => {
    // TODO: get total number all mails and important mails for today and this week
    return ctx.prisma.receivedMail
      .count({
        where: {
          date: {
            // for the last week
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
            lte: new Date(),
          },
        },
      })
      .then((res) => {
        return ctx.prisma.receivedMail
          .count({
            where: {
              date: {
                // for the last week
                gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                lte: new Date(),
              },
              importance: "IMPORTANT",
            },
          })
          .then((res2) => {
            return {
              total: res,
              important: res2,
            };
          });
      })
      .catch((err: string) => {
        throw new TRPCError({ message: err, code: "INTERNAL_SERVER_ERROR" });
      });
  }),

  createMail: protectedProcedure
    .input(
      z.object({
        date: z.string(),
        object: z.string(),
        sender: z.string(),
        importance: z.string(),
        userId: z.string(),
        filesUrls: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.receivedMail
        .create({
          data: {
            date: new Date(input.date),
            object: input.object,
            sender: input.sender,
            importance: input.importance,
            userId: input.userId,
            filesUrls: input.filesUrls,
          },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err: string) => {
          throw new TRPCError({ message: err, code: "INTERNAL_SERVER_ERROR" });
        });

      return "Mail sent";
    }),
});
