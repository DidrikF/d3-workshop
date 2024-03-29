import { createRouter } from "./trpcContext";
import { z } from "zod";
import Pusher from "pusher";
import { env } from "process";
import { TRPCError } from "@trpc/server";

const pusher = new Pusher({
  host: env.NEXT_PUBLIC_SOKETI_HOST!,
  appId: env.SOKETI_APP_ID!,
  key: env.NEXT_PUBLIC_SOKETI_APP_KEY!,
  secret: env.SOKETI_APP_SECRET!,
  useTLS: true,
});

const T_REX_GAME_CHANNEL_ID = "t-rex-game";
enum TRexGameEvent {
  ScoreAdded = "score-added",
}

export const gameRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  })
  .query("top10Scores", {
    async resolve({ ctx }) {
      return await ctx.prisma.score.findMany({
        include: { user: true },
        orderBy: { value: "desc" },
        take: 10,
      });
    },
  })
  .query("usersWithLast10Scores", {
    async resolve({ ctx }) {
      return await ctx.prisma.user.findMany({
        include: {
          Score: { orderBy: { id: "desc" }, take: 10, include: { user: true } },
        },
        take: 10,
      });
    },
  })
  .query("usersWithScores", {
    async resolve({ ctx }) {
      return await ctx.prisma.user.findMany({
        include: {
          Score: { orderBy: { id: "desc" }, include: { user: true } },
        },
        take: 10,
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
          userId: ctx.user!.id,
          value: input.score,
        },
        include: { user: true },
      });

      await pusher.trigger(
        T_REX_GAME_CHANNEL_ID,
        TRexGameEvent.ScoreAdded,
        result
      );

      return result;
    },
  });
