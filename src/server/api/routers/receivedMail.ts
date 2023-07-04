import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const receivedMailRouter = createTRPCRouter({
//   getAll: publicProcedure.query(({ ctx }) => {
//     return ctx.prisma.example.findMany();
//   }),

    createMail: protectedProcedure
        .input(
            z.object({
                address: z.string(),
                date: z.string(),
                object: z.string(),
                sender: z.string(),
                importance: z.string(),
                userId : z.string(),
                filesUrls: z.array(z.string()),
                transmission: z.string(),
            })
        )
        .mutation(async ({ctx, input}) => {
            await ctx.prisma.receivedMail.create({
                data: {
                    address: input.address,
                    date: new Date(input.date),
                    object: input.object,
                    sender: input.sender,
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
