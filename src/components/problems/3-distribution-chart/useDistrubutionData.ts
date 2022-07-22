import { usePusherChannel, usePusherEvent } from "../../../utils/pusher";
import { trpc } from "../../../utils/trpc";
import { Score, User } from "@prisma/client";
import { useMemo } from "react";

const T_REX_GAME_CHANNEL_ID = "t-rex-game";
enum TRexGameEvent {
  ScoreAdded = "score-added",
}

export type ScoreWithUser = Score & { user: User };
export type UserData = User & { scores: ScoreWithUser[] };

function useHistoryData(): UserData[] {
  const allScores = trpc.useQuery(["game.allScores"]);

  const channel = usePusherChannel(T_REX_GAME_CHANNEL_ID);
  usePusherEvent<ScoreWithUser>(channel, TRexGameEvent.ScoreAdded, () => {
    allScores.refetch();
  });

  return useMemo(
    () =>
      allScores.data?.map((user) => ({
        ...user,
        scores: user.Score,
      })) ?? [],
    [allScores]
  );
}

export default useHistoryData;
