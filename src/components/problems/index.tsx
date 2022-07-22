import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import TRexGame from "./t-rex-game";
import Top10Chart from "./1-top-10-chart/index";
import HistoryChart from "./2-history-chart";
import DistributionChart from "./3-distribution-chart";

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
      <TRexGame />

      <div className="bg-slate-400 h-1 rounded mt-2" />

      <nav
        aria-label="Select workshop task"
        className="flex justify-center gap-6 py-8"
      >
        <Tab value={TabName.Top10}>Top 10 scores chart</Tab>
        <Tab value={TabName.History}>Score history chart</Tab>
        <Tab value={TabName.Distribution}>Score distribution chart</Tab>
      </nav>

      <div>
        {tab === TabName.Top10 && <Top10Chart />}
        {tab === TabName.History && <HistoryChart />}
        {tab === TabName.Distribution && <DistributionChart />}
      </div>
    </>
  );
};

export default ProblemsPageContent;
