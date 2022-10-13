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

      <div
        ref={containerRef}
        className="relative inline w-fill w-[800px] h-[600px]"
      >
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
  const id = useId("bar-chart");

  const width = svgWidth - MARGIN.left - MARGIN.right;
  const height = svgHeight - MARGIN.top - MARGIN.bottom;

  const scales: Scales = useMemo(() => {
    return {
      x: d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value) ?? 0])
        .range([0, width]),
      y: d3
        .scaleBand()
        .domain(data.map((d) => String(d.id)))
        .range([height, 0])
        .padding(0.35),
    };
  }, [data, width, height]);

  return (
    <svg
      id={id}
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

  useEffect(() => {
    const xAxis = d3.axisBottom(xScale);

    d3.select(`#${id}`)
      .attr("class", "font-mono text-sm")
      .transition()
      .duration(ANIMATION_DURATION)
      .call(xAxis as any);
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

  useEffect(() => {
    const yAxis = d3
      .axisLeft(yScale)
      .tickSize(0)
      .tickFormat((_, index) => getName(data[index]?.user));

    d3.select(`#${id}`)
      .transition()
      .duration(ANIMATION_DURATION)
      .call(yAxis as any)

      .call((axis) =>
        axis.selectAll("text").attr("class", "font-mono text-lg -translate-x-2")
      );
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
     * Append, update and remove bars using data joins
     */
    dataContainer
      .selectAll("rect")
      .data(data, (d) => (d as ScoreWithUser).id)
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("y", (d) => scales.y(String(d.id))!)
            .attr("height", scales.y.bandwidth())
            .attr("x", 0)
            .attr("width", 0)
            .attr("rx", 2)
            .attr("fill", (_, i) => interpolateRdYlGn(i / 9)!)
            .call((_enter) =>
              _enter
                .transition("grow bar height with chained transitions")
                .duration(ANIMATION_DURATION)
                .attr("width", (d) => scales.x(d.value)!)
            ),
        (update) =>
          update
            .transition("update bars to match new data")
            .duration(ANIMATION_DURATION)
            .attr("y", (d) => scales.y(String(d.id))!)
            .attr("height", scales.y.bandwidth())
            .attr("width", (d) => scales.x(d.value)!)
            .attr("fill", (d, i) => interpolateRdYlGn(i / 10)!),
        (exit) => exit.transition().attr("opacity", 0).remove()
      );

    /**
     * Append, update and remove scores (as text nodes) using data joins
     */
    dataContainer
      .selectAll("text")
      .data(data, (d) => (d as ScoreWithUser).id)
      .join(
        (enter) =>
          enter
            .append("text")
            .attr(
              "class",
              "font-mono text-lg -translate-x-2 fill-white [alignment-baseline:middle]"
            )
            .attr("x", 10)
            .attr(
              "y",
              (d) => scales.y(String(d.id))! + scales.y.bandwidth() / 2
            )
            .text((d) => d.value)
            .call((_enter) =>
              _enter
                .transition("update score text positions to match new data")
                .duration(ANIMATION_DURATION)
                .attr("x", (d) => scales.x(d.value)! + 15)
            ),
        (update) =>
          update
            .transition("update score text positions to match new data")
            .duration(ANIMATION_DURATION)
            .attr("x", (d) => scales.x(d.value)! + 15)
            .attr(
              "y",
              (d) => scales.y(String(d.id))! + scales.y.bandwidth() / 2
            )
            .text((d) => d.value),
        (exit) => exit.transition().attr("opacity", 0).remove()
      );
  }, [id, data, scales]);

  return (
    <g
      id={id}
      style={{ transform: `translate(${MARGIN.left}px, ${MARGIN.top}px)` }}
    ></g>
  );
};
