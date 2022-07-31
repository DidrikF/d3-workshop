import type { NextPage } from "next";
import VisxLineChart from "../../components/visx-chart";

const Intro: NextPage = () => {
  return (
    <>
      <h1>Visx Example</h1>

      <VisxLineChart />
    </>
  );
};

export default Intro;
