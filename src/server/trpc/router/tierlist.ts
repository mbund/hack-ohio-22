import { t } from "../trpc";
import { z } from "zod";

export const tierlistRouter = t.router({
  getStif: t.procedure
    .query(async ({ ctx }) => {
        if (!ctx.session || !ctx.session.user) {
            return null;
        }
        return ctx.prisma.tierList.findMany({ where: { users: { some: { id: ctx.session.user.id } } } })
  }),
});
