// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import {frontPageRouter} from "./front-page";

export const appRouter = t.router({
  example: exampleRouter,
  auth: authRouter,
  frontPage: frontPageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
