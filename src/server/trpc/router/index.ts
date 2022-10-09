// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { z } from "zod";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { Prisma } from "@prisma/client";
import { frontPageRouter } from "./front-page";
import { tierlistRouter } from "./tierlist";

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export const appRouter = t.router({
  example: exampleRouter,
  auth: authRouter,
  tierlist: tierlistRouter,
  createTierList: t.procedure.input(jsonSchema).mutation(({ input, ctx }) => {
    if (!ctx.session || !ctx.session.user) {
      return null;
    }
    return ctx.prisma.tierList.create({
      data: {
        users: { connect: [{ id: ctx.session.user.id }] },
        stif: input
      }
    });
  }),
  setStif: t.procedure.input(z.object({ id: z.string(), stif: jsonSchema })).mutation(({ input, ctx }) => {
    return ctx.prisma.tierList.update({where: { id: input.id }, data: { stif: input.stif } })
  }),
  getTierList: t.procedure.input(z.string()).query(({ input:tierlistId, ctx }) => {
    return ctx.prisma.tierList.findFirst({ where: { id: tierlistId } })
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
