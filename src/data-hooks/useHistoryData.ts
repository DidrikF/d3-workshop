import {
  TRexGameEvent,
  T_REX_GAME_CHANNEL_ID,
  usePusherChannel,
  usePusherEvent,
} from "../utils/pusher";
import { trpc } from "../utils/trpc";
import { ScoreWithUser, UserData } from "./types";

function useHistoryData(): UserData[] {
  const scoreHistory = trpc.useQuery(["game.usersWithLast10Scores"]);

  const channel = usePusherChannel(T_REX_GAME_CHANNEL_ID);
  usePusherEvent<ScoreWithUser>(channel, TRexGameEvent.ScoreAdded, () => {
    scoreHistory.refetch();
  });

  return scoreHistory?.data ?? [];
}

export default useHistoryData;
