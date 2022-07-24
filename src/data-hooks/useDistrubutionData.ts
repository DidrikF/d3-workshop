import {
  TRexGameEvent,
  T_REX_GAME_CHANNEL_ID,
  usePusherChannel,
  usePusherEvent,
} from "../utils/pusher";
import { trpc } from "../utils/trpc";
import { ScoreWithUser, UserData } from "./types";

function useHistoryData(): UserData[] {
  const usersWithScores = trpc.useQuery(["game.usersWithScores"]);

  const channel = usePusherChannel(T_REX_GAME_CHANNEL_ID);
  usePusherEvent<ScoreWithUser>(channel, TRexGameEvent.ScoreAdded, () => {
    usersWithScores.refetch();
  });

  return usersWithScores?.data ?? [];
}

export default useHistoryData;
