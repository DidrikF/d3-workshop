import { usePusherChannel, usePusherEvent } from "../../../utils/pusher";
import { trpc } from "../../../utils/trpc";
import { Score, User } from "@prisma/client";
import { useMemo, useState } from "react";

const T_REX_GAME_CHANNEL_ID = "t-rex-game";
enum TRexGameEvent {
  ScoreAdded = "score-added",
}

export type ScoreWithUser = Score & { user: User };
export type BarData = {
  key: string;
  value: number;
  data: ScoreWithUser;
};

function useTop10Data(): BarData[] {
  const [newScores, setNewScores] = useState<BarData[]>([]);

  const channel = usePusherChannel(T_REX_GAME_CHANNEL_ID);
  usePusherEvent<ScoreWithUser>(channel, TRexGameEvent.ScoreAdded, (score) => {
    setNewScores((prev) => [
      ...prev,
      { key: String(score.id), value: score.value, data: score },
    ]);
  });

  const previousScores = trpc.useQuery(["game.top10Scores"], {
    enabled: !!channel,
  });

  return useMemo(() => {
    return [
      ...(previousScores.data?.map((score) => ({
        key: String(score.id),
        value: score.value,
        data: score,
      })) ?? []),
      ...newScores,
    ]
      .sort((a, b) => a.value - b.value)
      .slice(-10);
  }, [previousScores, newScores]);
}

export default useTop10Data;
