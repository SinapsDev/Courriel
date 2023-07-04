import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const sentMailRouter = createTRPCRouter({
//   getAll: publicProcedure.query(({ ctx }) => {
//     return ctx.prisma.example.findMany();
//   }),

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
