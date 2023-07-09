import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { utapi } from "uploadthing/server";

export const sentMailRouter = createTRPCRouter({
  getTotal: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.sentMail.count();
  }),

  getAll: protectedProcedure
    .input(
      z.object({
        skip: z.number(),
        take: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.sentMail.findMany({
        take: input.take,
        skip: input.skip,
        orderBy: {
          date: "desc",
        },
      });
    }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.sentMail.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  getByFilter: protectedProcedure
    .input(
      z.object({
        object: z.string().optional(),
        receiver: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        orderNumber: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.sentMail.findMany({
        where: {
          orderNumber: {
            contains: input.orderNumber,
          },
          object: {
            contains: input.object,
          },
          receiver: {
            contains: input.receiver,
          },
          date: {
            gte: input.startDate ? new Date(input.startDate) : new Date(0),
            lte: input.endDate ? new Date(input.endDate) : new Date(),
          },
        },
      });
    }),

  getNumberOfMailsInDetailsForToday: protectedProcedure.query(({ ctx }) => {
    // TODO: get total number all mails and important mails for today and this week
    return ctx.prisma.sentMail
      .count({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(),
          },
        },
      })
      .then((res) => {
        return ctx.prisma.sentMail
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
    return ctx.prisma.receivedMail
      .count({
        where: {
          date: {
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
        receiver: z.string(),
        importance: z.string(),
        userId: z.string(),
        filesUrls: z.string(),
        orderNumber: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.sentMail
        .create({
          data: {
            date: new Date(input.date),
            object: input.object,
            receiver: input.receiver,
            importance: input.importance,
            userId: input.userId,
            filesUrls: input.filesUrls,
            orderNumber: input.orderNumber,
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
  deleteMail: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.sentMail
        .delete({
          where: {
            id: input.id,
          },
        })
        .catch((err: string) => {
          throw new TRPCError({ message: err, code: "INTERNAL_SERVER_ERROR" });
        })
        .then((res) => {
          console.log(res.filesUrls);
          utapi.deleteFiles(JSON.parse(res.filesUrls));
        });

      return "Mail deleted";
    }),
});
