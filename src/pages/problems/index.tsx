import { Divider, Tab, Tabs, Typography } from "@mui/material";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { Suspense } from "react";
import { MyHistoryChart } from "../../components/charts/MyHistoryChart";

import { trpc } from "../../utils/trpc";

const TRexGame = dynamic(() => import("../../components/t-rex-game"), {
  ssr: false,
  suspense: true,
});

export enum TabNames {
  MyHistory = "my-history",
  Top20 = "top-20",
  AllScores = "all-scores",
}

const Problems: NextPage = () => {
  const { query } = useRouter();
  const selectedTab = Math.max(
    Object.values(TabNames).findIndex((t) => t === query.tab),
    0
  );

  const yourScores = trpc.useQuery(["game.yourScores"]);
  const allScores = trpc.useQuery(["game.allScores"]);
  const addScoreMutation = trpc.useMutation(["game.addScore"]);

  const gameOverHandler = (score: number) => {
    console.log("game over", score);
    addScoreMutation.mutate({ score: score });
  };

  return (
    <>
      <Suspense fallback={<div>Loading game...</div>}>
        <TRexGame onGameOver={gameOverHandler} />
      </Suspense>

      <Divider sx={{ mt: 4 }} />
      <Tabs value={selectedTab} aria-label="Select workshop task" centered>
        <Link
          href={{ pathname: "/problems", query: { tab: TabNames.MyHistory } }}
        >
          <Tab value={TabNames.MyHistory} label="My score history"></Tab>
        </Link>
        <Link href={{ pathname: "/problems", query: { tab: TabNames.Top20 } }}>
          <Tab value={TabNames.Top20} label="Top 20 scores" />
        </Link>
        <Link
          href={{ pathname: "/problems", query: { tab: TabNames.AllScores } }}
        >
          <Tab value={TabNames.AllScores} label="All scores" />
        </Link>
      </Tabs>

      {query.tab === TabNames.MyHistory && <MyHistoryChart />}

      <Typography>Your scores</Typography>
      <ul>
        {yourScores.data?.map((score) => (
          <li key={score.id}>{score.value}</li>
        ))}
      </ul>
      <Typography>All scores</Typography>
      <ul>
        {allScores.data?.map((score) => (
          <li key={score.id}>{score.value}</li>
        ))}
      </ul>
    </>
  );
  return <div>Problems</div>;
};

export default Problems;
