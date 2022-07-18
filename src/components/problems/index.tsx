import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import TRexGame from "./t-rex-game";
import { AllScoresChart } from "./charts/AllScoresChart";
import { MyHistoryChart } from "./charts/MyHistoryChart";
import { Top20Chart } from "./charts/Top20Chart";

export enum TabName {
  MyHistory = "my-history",
  Top20 = "top-20",
  AllScores = "all-scores",
}

const Tab: React.FC<{ children: React.ReactNode; value: TabName }> = ({
  children,
  value,
}) => {
  return (
    <Link href={{ pathname: "/problems", query: { tab: value } }}>
      <a className={"active:to-blue-400"}>{children}</a>
    </Link>
  );
};

const ProblemsPageContent: NextPage = () => {
  const { query } = useRouter();

  return (
    <>
      <TRexGame />

      <div className="border-b-gray-900" />

      <nav aria-label="Select workshop task" className="flex gap-4">
        <Tab value={TabName.MyHistory}>My score history</Tab>
        <Tab value={TabName.Top20}>Top 20 scores</Tab>
        <Tab value={TabName.AllScores}>All scores</Tab>
      </nav>

      {query.tab === TabName.MyHistory && <MyHistoryChart />}
      {query.tab === TabName.Top20 && <Top20Chart />}
      {query.tab === TabName.AllScores && <AllScoresChart />}
    </>
  );
};

export default ProblemsPageContent;
