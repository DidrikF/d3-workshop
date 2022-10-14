import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import TRexGame from "../t-rex-game";
import Top10Chart from "./1-top-10-chart";
import Top10ChartProblemDescription from "./1-top-10-chart/problem-descriptions.mdx";
import HistoryChart from "./2-history-chart";
import HistoryChartProblemDescription from "./2-history-chart/problem-descriptions.mdx";
import DistributionChart from "./3-distribution-chart";
import DistributionChartProblemDescription from "./3-distribution-chart/problem-descriptions.mdx";

export enum TabName {
  Top10 = "top-10",
  History = "history",
  Distribution = "distribution",
}

const Tab: React.FC<{ children: React.ReactNode; value: TabName }> = ({
  children,
  value,
}) => {
  const router = useRouter();
  const tabHref = `/problems/${value}`;

  console.log(router.asPath);

  return (
    <Link href={tabHref}>
      <a
        className={`underline transition-colors active:text-blue-400 ${
          router.asPath === tabHref ? "text-blue-500" : "hover:text-blue-300"
        }`}
      >
        {children}
      </a>
    </Link>
  );
};

const ProblemsPageContent: NextPage = () => {
  const { query } = useRouter();
  const tab = query.tab?.[0];

  return (
    <>
      <h1>Problem sets</h1>

      <TRexGame />

      <div className="border-slate-700 border-b-[1px] mt-2" />

      <nav
        aria-label="Select workshop task"
        className="flex justify-center gap-6 py-8"
      >
        <Tab value={TabName.Top10}>Top 10 scores chart</Tab>
        <Tab value={TabName.History}>Score history chart</Tab>
        <Tab value={TabName.Distribution}>Score distribution chart</Tab>
      </nav>

      <div>
        {tab === TabName.Top10 && (
          <>
            <Top10Chart />
            <div className="markdown-body mt-10">
              <Top10ChartProblemDescription />
            </div>
          </>
        )}
        {tab === TabName.History && (
          <>
            <HistoryChart />
            <div className="markdown-body mt-10">
              <HistoryChartProblemDescription />
            </div>
          </>
        )}
        {tab === TabName.Distribution && (
          <>
            <DistributionChart />
            <div className="markdown-body mt-10">
              <DistributionChartProblemDescription />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProblemsPageContent;
