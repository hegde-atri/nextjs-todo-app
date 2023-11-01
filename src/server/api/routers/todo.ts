import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const todoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        state: z.number().max(1).min(0).default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.create({
        data: {
          content: input.content,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  hello: publicProcedure.query(() => {
    return {
      greeting: `Hello`,
      hello: "",
    };
  }),

  testing: publicProcedure.query(() => {
    return {
      message: "",
      user: "",
    };
  }),
});
