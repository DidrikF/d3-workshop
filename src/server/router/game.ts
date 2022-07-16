import { createRouter } from "./context";
import { z } from "zod";

export const gameRouter = createRouter()
  .query("allScores", {
    async resolve({ ctx }) {
      return await ctx.prisma.score.findMany();
    },
  })
  .query("yourScores", {
    async resolve({ ctx }) {
      return await ctx.prisma.score.findMany({
        where: {
          userId: "1",
        },
      });
    },
  })
  .mutation("addScore", {
    input: z.object({
      score: z.number(),
    }),
    async resolve({ ctx, input }) {
      const result = await ctx.prisma.score.create({
        data: {
          userId: "1",
          value: input.score,
        },
      });
      return result;
    },
  });
