import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { db } from "~/server/db";
import type { Todo } from "@prisma/client";

const addUserDataToPosts = async (todos: Todo[]) => {
  const userIds = todos.map((todo) => todo.createdById);
  const users = await db.user.findMany({ where: { id: { in: userIds } } });
  // Here we would also filter user information so only needed information gets passed around

  return todos.map((todo) => {
    const author = users.find((user) => user.id === todo.createdById);
    return { todo, author };
  });
};

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
          done: false,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const todos = await ctx.db.todo.findMany({
      take: 100,
      orderBy: [{ done: "asc" }, { createdAt: "desc" }],
    });
    return todos;
  }),

  updateDoneStatus: protectedProcedure
    .input(
      z.object({
        todoId: z.number(),
        done: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { todoId, done } = input;
      const updatedTodo = await ctx.db.todo.update({
        where: { id: todoId },
        data: {
          done,
        },
      });

      return updatedTodo;
    }),

  deleteTodo: protectedProcedure
    .input(
      z.object({
        todoId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.todo.delete({
        where: { id: input.todoId },
      });
    }),
});
