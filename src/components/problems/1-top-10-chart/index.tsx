import { useEffect, useMemo } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "../../../hooks/useResizeObserver";
import { useId } from "../../../hooks/useId";
import useTop10Data from "../../../data-hooks/useTop10Data";
import { interpolateRdYlGn } from "d3-scale-chromatic";
import { ScoreWithUser } from "../../../data-hooks/types";
import { getName } from "../../../utils/helpers";

const MARGIN = {
  top: 20,
  right: 80,
  bottom: 50,
  left: 100,
};

const ANIMATION_DURATION = 1000;

type Scales = {
  x: d3.AxisScale<d3.NumberValue>;
  y: d3.ScaleBand<string>;
};

const Top10Chart = () => {
  const [size, containerRef] = useResizeObserver();
  const data = useTop10Data();

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-6 text-3xl">Top 10 Scores</h2>
      <p>The 10 highest scores any player has achieved</p>

      <div ref={containerRef} className="relative inline w-[800px] h-[600px]">
        {size && data.length > 0 && (
          <BarChart data={data} svgWidth={size.width} svgHeight={size.height} />
        )}
      </div>
    </div>
  );
};

export default Top10Chart;

const BarChart = ({
  data,
  svgWidth,
  svgHeight,
}: {
  data: ScoreWithUser[];
  svgWidth: number;
  svgHeight: number;
}) => {
  console.log("The data you are working with: ", data);

  const width = svgWidth - MARGIN.left - MARGIN.right;
  const height = svgHeight - MARGIN.top - MARGIN.bottom;

  /**
   * Problem 1
   */
  const scales: Scales = useMemo(() => {
    return {
      x: d3.scaleLinear(), // Your code goes here. Hint: define the domain and range
      y: d3.scaleBand(), // Your code goes here. Hint: define the domain, range and padding
    };
  }, [data, width, height]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute"
      style={{
        width: `${svgWidth}px`,
        height: `${svgHeight}px`,
      }}
    >
      <Bars scales={scales} data={data} />
      <XAxis
        xScale={scales.x}
        height={height}
        svgHeight={svgHeight}
        svgWidth={svgWidth}
      />
      <YAxis yScale={scales.y} data={data} />
    </svg>
  );
};

const XAxis = ({
  xScale,
  height,
  svgHeight,
  svgWidth,
}: {
  xScale: Scales["x"];
  height: number;
  svgWidth: number;
  svgHeight: number;
}) => {
  const id = useId("x-axis");

  /**
   * Problem 2
   */
  useEffect(() => {
    // Your code goes here. Hint: use d3.axisBottom
  }, [id, xScale]);

  return (
    <>
      <g
        id={id}
        style={{
          transform: `translate(${MARGIN.left}px, ${MARGIN.top + height}px)`,
        }}
      />
      <text className="fill-white" x={svgWidth / 2} y={svgHeight}>
        Score
      </text>
    </>
  );
};

const YAxis = ({
  yScale,
  data,
}: {
  yScale: Scales["y"];
  data: ScoreWithUser[];
}) => {
  const id = useId("y-axis");

  /**
   * Problem 3
   */
  useEffect(() => {
    // Your code goes here.
    // Hints:
    // 1. use d3.axisLeft
    // 2. define the tick labels using: tickFormat((_, index) => getName(data[index]?.user))
  }, [id, yScale, data]);

  return (
    <g
      id={id}
      style={{ transform: `translate(${MARGIN.left}px, ${MARGIN.top}px)` }}
    />
  );
};

const Bars = ({ scales, data }: { scales: Scales; data: ScoreWithUser[] }) => {
  const id = useId("data-container");

  useEffect(() => {
    const dataContainer = d3.select(`#${id}`);

    /**
     * Problem 4 and 5
     */
    dataContainer.selectAll("rect"); // Your code goes here

    /**
     * Problem 6 (optional)
     */
    dataContainer.selectAll("text"); // Your code goes here
  }, [id, data, scales]);

  return (
    <g
      id={id}
      style={{ transform: `translate(${MARGIN.left}px, ${MARGIN.top}px)` }}
    ></g>
  );
};
