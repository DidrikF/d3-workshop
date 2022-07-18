import { createRouter } from "./context";
import { never, z } from "zod";
import Pusher from "pusher";
import { env } from "process";

const pusher = new Pusher({
  appId: env.PUSHER_APP_ID!,
  key: env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: env.PUSHER_APP_SECRET!,
  cluster: env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
  useTLS: true,
});

const T_REX_GAME_CHANNEL_ID = "t-rex-game";
enum TRexGameEvent {
  ScoreAdded = "score-added",
}

export const gameRouter = createRouter()
  .query("allScores", {
    async resolve({ ctx }) {
      return await ctx.prisma.score.findMany();
    },
  })
  .query("yourScores", {
    async resolve({ ctx }) {
      return await ctx.prisma.score.findMany({
        // where: {
        //   userId: "1",
        // },
      });
    },
  })
  .mutation("addScore", {
    input: z.object({
      score: z.number(),
    }),
    async resolve({ ctx, input }) {
      const scoreRecord = {
        userId: Math.random().toFixed(7),
        value: input.score,
      };

      const result = await ctx.prisma.score.create({
        data: scoreRecord,
      });

      pusher.trigger(
        T_REX_GAME_CHANNEL_ID,
        TRexGameEvent.ScoreAdded,
        scoreRecord
      );

      return result;
    },
  });
