import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { utapi } from "uploadthing/server";
import { getMonday } from "~/utils/getMonday";

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
          id: "desc",
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

  getByOrderNumber: protectedProcedure
    .input(
      z.object({
        orderNumber: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.sentMail.findMany({
        where: {
          orderNumber: input.orderNumber,
        },
      });
    }),

  editMail: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        date: z.string().optional(),
        object: z.string().optional(),
        receiver: z.string().optional(),
        importance: z.string().optional(),
        filesUrls: z.string().optional(),
        orderNumber: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.sentMail
        .update({
          where: {
            id: input.id,
          },
          data: {
            date: input.date ? new Date(input.date) : undefined,
            object: input.object,
            receiver: input.receiver,
            importance: input.importance,
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
    return ctx.prisma.sentMail
      .count({
        where: {
          date: {
            gte: getMonday(),
            lte: new Date(),
          },
        },
      })
      .then((res) => {
        return ctx.prisma.sentMail
          .count({
            where: {
              date: {
                gte: getMonday(),
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
  deleteByOrderNumber: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.sentMail
        .deleteMany({
          where: {
            orderNumber: input.id,
          },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err: string) => {
          throw new TRPCError({ message: err, code: "INTERNAL_SERVER_ERROR" });
        });

      return "Mail deleted";
    }),
});
