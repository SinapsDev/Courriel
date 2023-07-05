import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const sentMailRouter = createTRPCRouter({
    getTotal: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.sentMail.count();
    }),

    getAll: publicProcedure.input(z.object({
        skip: z.number(),
        take: z.number(),
    })).query(({ ctx, input }) => {
        return ctx.prisma.sentMail.findMany({
            take: input.take,
            skip: input.skip,
            orderBy: {
                date: "asc",
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
