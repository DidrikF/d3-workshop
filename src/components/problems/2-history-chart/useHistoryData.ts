import { usePusherChannel, usePusherEvent } from "../../../utils/pusher";
import { trpc } from "../../../utils/trpc";
import { Score, User } from "@prisma/client";
import { useMemo } from "react";

const T_REX_GAME_CHANNEL_ID = "t-rex-game";
enum TRexGameEvent {
  ScoreAdded = "score-added",
}

export type ScoreWithUser = Score & { user: User };
export type DataPoint = {
  key: string;
  value: number;
  data: ScoreWithUser;
};

function useHistoryData(): DataPoint[][] | undefined {
  const scoreHistory = trpc.useQuery(["game.scoreHistory"]);

  const channel = usePusherChannel(T_REX_GAME_CHANNEL_ID);
  usePusherEvent<ScoreWithUser>(channel, TRexGameEvent.ScoreAdded, () => {
    scoreHistory.refetch();
  });

  return useMemo(
    () =>
      scoreHistory.data?.map((user) =>
        user.Score.map((score, i) => ({
          key: String(i + 1),
          value: score.value,
          data: score,
        }))
      ),
    [scoreHistory]
  );
}

export default useHistoryData;
