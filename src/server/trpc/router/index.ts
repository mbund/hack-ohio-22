// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { z } from "zod";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { Prisma } from "@prisma/client";
import { frontPageRouter } from "./front-page";

export const appRouter = t.router({
  example: exampleRouter,
  auth: authRouter,
  createTierList: t.procedure.mutation(({ ctx }) => {
    if (!ctx.session || !ctx.session.user) {
      return null;
    }
    return ctx.prisma.tierList.create({
      data: {
        users: { connect: [{ id: ctx.session.user.id }] }
      }
    });
  }),
  getTierLists: t.procedure.query(({ ctx }) => {
    if (!ctx.session || !ctx.session.user) {
      return null;
    }
    return ctx.prisma.tierList.findMany({ where: { users: { some: { id: ctx.session.user.id } } } })
  }),
  getTierListUsers: t.procedure
    .input(z.string())
    .query(({ input, ctx }) => {
      return ctx.prisma.user.findMany({
        where: { tierLists: { some: { id: input } } }
      });
    }),
  frontPage: frontPageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
