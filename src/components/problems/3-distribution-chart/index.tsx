/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo } from "react";
import * as d3 from "d3";
import { interpolateSinebow } from "d3-scale-chromatic";
import { useId } from "../../../hooks/useId";
import { useResizeObserver } from "../../../hooks/useResizeObserver";
import useHistoryData from "../../../data-hooks/useDistrubutionData";
import { ScoreWithUser, UserData } from "../../../data-hooks/types";
import { getName } from "../../../utils/helpers";

const MARGIN = {
  top: 20,
  right: 10,
  bottom: 60,
  left: 80,
};
const ANIMATION_DURATION = 1000;
const PROFILE_PICTURE_SIZE = 30;

type Scales = {
  x: d3.ScalePoint<string>;
  y: d3.ScaleLinear<number, number, never>;
};

const DistributionChart = () => {
  const [size, containerRef] = useResizeObserver();
  const data = useHistoryData();

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-4 text-3xl">Score Distribution</h2>
      <p>Scatter plots of all scores of each player.</p>
      <p>The lines marks the mean score of each player.</p>

      <div
        ref={containerRef}
        className="relative inline-block w-fill w-[800px] h-[600px] mb-28"
      >
        {size && data && data.length > 0 && (
          <ScatterChart
            data={data}
            svgWidth={size.width}
            svgHeight={size.height}
          />
        )}
      </div>
    </div>
  );
};

export default DistributionChart;

const ScatterChart = ({
  data,
  svgWidth,
  svgHeight,
}: {
  data: UserData[];
  svgWidth: number;
  svgHeight: number;
}) => {
  console.log("The data you are working with: ", data);

  const id = useId("multi-line-chart");

  const width = svgWidth - MARGIN.left - MARGIN.right;
  const height = svgHeight - MARGIN.top - MARGIN.bottom;

  const scales: Scales = useMemo(() => {
    return {
      x: d3
        .scalePoint()
        .domain(data.map((d) => d.name!))
        .range([0, width])
        .padding(0.15),
      y: d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data, (user) => d3.max(user.Score, (d) => d.value)) ?? 0,
        ])
        .range([height, 0]),
    };
  }, [data, width, height]);

  return (
    <>
      <svg
        id={id}
        xmlns="http://www.w3.org/2000/svg"
        className="absolute"
        style={{
          width: `${svgWidth}px`,
          height: `${svgHeight}px`,
        }}
      >
        <ScatterPlots scales={scales} data={data} />

        <XAxis
          xScale={scales.x}
          data={data}
          height={height}
          svgHeight={svgHeight}
          svgWidth={svgWidth}
        />
        <YAxis yScale={scales.y} svgHeight={svgHeight} svgWidth={svgWidth} />
      </svg>
    </>
  );
};

const XAxis = ({
  xScale,
  data,
  height,
}: {
  xScale: Scales["x"];
  data: UserData[];
  height: number;
  svgWidth: number;
  svgHeight: number;
}) => {
  const id = useId("x-axis");

  useEffect(() => {
    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat((_, index) => getName(data[index]));

    d3.select(`#${id}`)
      .transition()
      .duration(ANIMATION_DURATION)
      .call(xAxis as any)
      .call((g) =>
        g.selectAll("text").attr("class", "font-mono text-sm translate-y-9")
      );

    d3.select(`#${id}`)
      .selectAll("image")
      .data(data, (d) => (d as UserData).id)
      .join(
        (enter) =>
          enter
            .append("image")
            .attr("xlink:href", (d) => d.image)
            .attr("x", (d) => xScale(d.name!)! - PROFILE_PICTURE_SIZE / 2)
            .attr("y", 10)
            .attr("height", PROFILE_PICTURE_SIZE)
            .attr("width", PROFILE_PICTURE_SIZE)
            .attr("opacity", 0)
            .call((_enter) =>
              _enter
                .transition()
                .duration(ANIMATION_DURATION)
                .attr("opacity", 1)
            ),
        (update) =>
          update
            .transition("update image positions to match new data")
            .duration(ANIMATION_DURATION)
            .attr("x", (d) => xScale(d.name!)! - PROFILE_PICTURE_SIZE / 2)
            .attr("y", 10),
        (exit) => exit.transition().attr("opacity", 0).remove()
      );
  }, [id, xScale, data, height]);

  return (
    <>
      <g
        id={id}
        style={{
          transform: `translate(${MARGIN.left}px, ${MARGIN.top + height}px)`,
        }}
      />
    </>
  );
};

const YAxis = ({
  yScale,
  svgHeight,
  svgWidth,
}: {
  yScale: Scales["y"];
  svgWidth: number;
  svgHeight: number;
}) => {
  const id = useId("y-axis");

  useEffect(() => {
    const yAxis = d3.axisLeft(yScale);

    d3.select(`#${id}`)
      .attr("class", "font-mono text-sm -translate-x-2")
      .transition()
      .duration(ANIMATION_DURATION)
      .call(yAxis as any);
  }, [id, yScale]);

  return (
    <>
      <g
        id={id}
        style={{ transform: `translate(${MARGIN.left}px, ${MARGIN.top}px)` }}
      />
      <text
        className="fill-white"
        style={{
          textAnchor: "middle",
          dominantBaseline: "middle",
          transform: `translate(10px, ${svgHeight / 2}px) rotate(-90deg)`,
        }}
      >
        Score
      </text>
    </>
  );
};

const ScatterPlots = ({
  scales,
  data,
}: {
  scales: Scales;
  data: UserData[];
}) => {
  const id = useId("scatter-container");

  /**
   * Problem 1
   */
  useEffect(() => {
    const dataContainer = d3.select(`#${id}`);

    dataContainer.selectAll("circle").data(
      data.flatMap((userData) => userData.Score),
      (d) => (d as ScoreWithUser).id
    );
    // Your code goes here. Continue with .join(...)
  }, [data, id, scales]);

  return (
    <g
      id={id}
      style={{ transform: `translate(${MARGIN.left}px, ${MARGIN.top}px)` }}
    ></g>
  );
};
