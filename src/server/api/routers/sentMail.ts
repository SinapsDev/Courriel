import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const sentMailRouter = createTRPCRouter({
    getTotal: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.sentMail.count();
    }),

    getAll: protectedProcedure.input(z.object({
        skip: z.number(),
        take: z.number(),
    })).query(({ ctx, input }) => {
        return ctx.prisma.sentMail.findMany({
            take: input.take,
            skip: input.skip,
            orderBy: {
                date: "desc",
            },
        });
    }),

    getById: protectedProcedure.input(z.object({
        id: z.number(),
    })).query(({ ctx, input }) => {
        return ctx.prisma.sentMail.findUnique({
            where: {
                id: input.id,
            },
        });
    }),

    getByFilter: protectedProcedure.input(z.object({
        object: z.string().optional(),
        receiver: z.string().optional(),
        transmission: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional()
    })).query(({ ctx, input }) => {
        return ctx.prisma.sentMail.findMany({
            where: {
                object: {
                    contains: input.object,
                },
                receiver: {
                    contains: input.receiver,
                },
                transmission: {
                    contains: input.transmission,
                },
                date: {
                    gte: input.startDate ? new Date(input.startDate) : new Date(0),
                    lte: input.endDate ? new Date(input.endDate) : new Date(),
                }
            },
        });
    }),

    createMail: protectedProcedure
        .input(
            z.object({
                address: z.string(),
                date: z.string(),
                object: z.string(),
                receiver: z.string(),
                importance: z.string(),
                userId : z.string(),
                filesUrls: z.string(),
                transmission: z.string(),
            })
        )
        .mutation(async ({ctx, input}) => {
            await ctx.prisma.sentMail.create({
                data: {
                    address: input.address,
                    date: new Date(input.date),
                    object: input.object,
                    receiver: input.receiver,
                    importance: input.importance,
                    userId: input.userId,
                    filesUrls: input.filesUrls,
                    transmission: input.transmission,
                },
            }).then((res) => {
                console.log(res);
            }).catch((err: string) => {
                throw new TRPCError({message: err, code: "INTERNAL_SERVER_ERROR"})
            })

            return "Mail sent";
        }),
});
