import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const permissionRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      const permissions = ctx.prisma.userPermission.findUnique({
        where: {
          id: input.id,
        },
      });
      return permissions;
    }),
  createDefaultPermissions: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const permissions = ctx.prisma.userPermission.create({
        data: {
          userId: input.userId,
          canAccess: false,
          isAdmin: false,
          canAdd: false,
          canDel: false,
          canEdit: false,
          canReadReceived: false,
          canReadSent: false,
          id: input.userId,
        },
      });
      return permissions;
    }),

  updatePermissions: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        isAdmin: z.boolean(),
        canAdd: z.boolean(),
        canDel: z.boolean(),
        canReadReceived: z.boolean(),
        canReadSent: z.boolean(),
        canAccess: z.boolean(),
        canEdit: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      const permissions = ctx.prisma.userPermission.update({
        where: {
          id: input.userId,
        },
        data: {
          isAdmin: input.isAdmin,
          canAdd: input.canAdd,
          canDel: input.canDel,
          canReadReceived: input.canReadReceived,
          canReadSent: input.canReadSent,
          canAccess: input.canAccess,
          canEdit: input.canEdit,
        },
      });
      return permissions;
    }),
});
