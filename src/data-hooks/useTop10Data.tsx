import {
  TRexGameEvent,
  T_REX_GAME_CHANNEL_ID,
  usePusherChannel,
  usePusherEvent,
} from "../utils/pusher";
import { trpc } from "../utils/trpc";
import { useMemo, useState } from "react";
import { ScoreWithUser } from "./types";

function useTop10Data(): ScoreWithUser[] {
  const [newScores, setNewScores] = useState<ScoreWithUser[]>([]);

  const channel = usePusherChannel(T_REX_GAME_CHANNEL_ID);
  usePusherEvent<ScoreWithUser>(channel, TRexGameEvent.ScoreAdded, (score) => {
    setNewScores((prev) => [...prev, score]);
  });

  const previousScores = trpc.useQuery(["game.top10Scores"], {
    enabled: !!channel,
  });

  return useMemo(() => {
    return [...(previousScores?.data ?? []), ...newScores]
      .sort((a, b) => a.value - b.value)
      .slice(-10);
  }, [previousScores, newScores]);
}

export default useTop10Data;
