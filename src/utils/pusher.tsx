import Pusher, { Channel } from "pusher-js";
import shallow from "zustand/shallow";
import create from "zustand";
import { useEffect } from "react";
import { useEvent } from "../hooks/useEvent";
import { pick } from "lodash";

export const T_REX_GAME_CHANNEL_ID = "t-rex-game";
export enum TRexGameEvent {
  ScoreAdded = "score-added",
}

const pusherClient = new Pusher(process.env.NEXT_PUBLIC_SOKETI_APP_KEY!, {
  wsHost: process.env.NEXT_PUBLIC_SOKETI_HOST!,
  forceTLS: true,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
});

export const usePusherStore = create<{
  pusherClient: Pusher;
  channels: Map<string, Channel>;
  addChannel: (channelId: string, channel: Channel) => void;
  removeChannel: (channelId: string) => void;
}>((set) => ({
  pusherClient: pusherClient,
  channels: new Map(),
  addChannel: (channelId, channel) =>
    set((state) => {
      state.channels.set(channelId, channel);

      return {
        channels: new Map(state.channels),
      };
    }),
  removeChannel: (channelId) =>
    set((state) => {
      state.channels.delete(channelId);

      return {
        channels: new Map(state.channels),
      };
    }),
}));

export function usePusherChannel(
  channelId: string,
  onSuccess: () => void = () => undefined
): Channel | undefined {
  const pusherClient = usePusherStore((state) => state.pusherClient);
  const { addChannel, removeChannel } = usePusherStore(
    (state) => pick(state, ["addChannel", "removeChannel"]),
    shallow
  );

  const stableOnSuccess = useEvent(onSuccess);

  useEffect(() => {
    const channel = pusherClient.subscribe(channelId);

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("Successfully subscribed to channel: ", channelId);
      stableOnSuccess();
    });

    addChannel(channelId, channel);

    return () => {
      channel.disconnect();
      removeChannel(channelId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  return usePusherStore((state) => state.channels.get(channelId));
}

export function usePusherEvent<MessageType>(
  channel: Channel | undefined,
  eventName: string,
  callback: (data: MessageType) => void
) {
  const stableCallback = useEvent(callback);

  useEffect(() => {
    if (channel) {
      channel.bind(eventName, stableCallback);
      console.log("Bound to event: ", eventName);

      return () => {
        channel.unbind(eventName, stableCallback);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, eventName]);
}
