/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo } from "react";
import { useId } from "../../../hooks/useId";
import { useResizeObserver } from "../../../hooks/useResizeObserver";
import useHistoryData, { DataPoint } from "./useHistoryData";
import * as d3 from "d3";
import { interpolateSinebow } from "d3-scale-chromatic";
import { interpolatePath } from "d3-interpolate-path";
import { range } from "lodash";
import { isDefined } from "../../../utils/helpers";

const MARGIN = {
  top: 20,
  right: 70,
  bottom: 50,
  left: 10,
};
const ANIMATION_DURATION = 1000;
const PROFILE_PICTURE_SIZE = 32;

type Scales = {
  x: d3.ScalePoint<string>;
  y: d3.ScaleLinear<number, number, never>;
};

const HistoryChart = () => {
  const [size, containerRef] = useResizeObserver();
  const data = useHistoryData();

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-4 text-3xl">Score History</h2>
      <p>The last 10 scores of each player</p>

      <div
        ref={containerRef}
        className="relative inline-block w-fill w-[800px] h-[600px] mb-28"
      >
        {size && data && data.length > 0 && (
          <MultiLineChart
            data={data}
            svgWidth={size.width}
            svgHeight={size.height}
          />
        )}
      </div>
    </div>
  );
};

export default HistoryChart;

const MultiLineChart = ({
  data,
  svgWidth,
  svgHeight,
}: {
  data: DataPoint[][];
  svgWidth: number;
  svgHeight: number;
}) => {
  const id = useId("multi-line-chart");

  const width = svgWidth - MARGIN.left - MARGIN.right;
  const height = svgHeight - MARGIN.top - MARGIN.bottom;

  const scales: Scales = useMemo(() => {
    return {
      x: d3
        .scalePoint()
        .domain(range(10, -1).map((num) => String(num)))
        .range([0, width]),
      y: d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data, (userData) => d3.max(userData, (d) => d.value)) ?? 0,
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
        {data.map((userData, i) => {
          const userId = userData[0]?.data.userId;

          if (!userId) return null;

          return (
            <Line
              key={userId}
              scales={scales}
              data={userData}
              lineColor={interpolateSinebow(i / data.length)}
            />
          );
        })}

        <XAxis
          xScale={scales.x}
          height={height}
          svgHeight={svgHeight}
          svgWidth={svgWidth}
        />
        <YAxis yScale={scales.y} svgHeight={svgHeight} svgWidth={svgWidth} />

        <ProfilePictures yScale={scales.y} data={data} svgWidth={svgWidth} />
      </svg>

      <div
        className="relative flex items-center justify-center gap-4"
        style={{ top: svgHeight + 30 }}
      >
        {data.map((userData, i) => {
          const user = userData[0]?.data.user;
          if (!user) return null;
          return (
            <Legend
              key={user.id}
              profilePictureUrl={user.image ?? ""}
              name={user.name?.split(" ")[0] ?? "Unknown user"}
              color={interpolateSinebow(i / data.length)}
            />
          );
        })}
      </div>
    </>
  );
};

const XAxis = ({
  xScale,
  height,
  svgWidth,
  svgHeight,
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

      <text
        className="fill-white [text-anchor:middle]"
        x={svgWidth / 2}
        y={svgHeight - 5}
      >
        Last attempts
      </text>
    </>
  );
};

const YAxis = ({
  yScale,
  svgHeight,
  svgWidth,
}: {
  yScale: Scales["y"];
  svgHeight: number;
  svgWidth: number;
}) => {
  const id = useId("y-axis");

  useEffect(() => {
    const yAxis = d3.axisRight(yScale);

    d3.select(`#${id}`)
      .transition()
      .duration(ANIMATION_DURATION)
      .call(yAxis as any)

      .call((axis) =>
        axis.selectAll("text").attr("class", "font-mono text-sm")
      );
  }, [id, yScale]);

  return (
    <>
      <g
        id={id}
        style={{
          transform: `translate(${svgWidth - MARGIN.right}px, ${MARGIN.top}px)`,
        }}
      />

      <text
        className="fill-white [text-anchor:middle]"
        style={{
          transform: `translate(${svgWidth - 5}px, ${
            svgHeight / 2
          }px) rotate(-90deg)`,
        }}
      >
        Score
      </text>
    </>
  );
};

const Line = ({
  scales,
  data,
  lineColor,
}: {
  scales: Scales;
  data: DataPoint[];
  lineColor: string;
}) => {
  const id = useId("line");

  useEffect(() => {
    const pathContainer = d3.select(`#${id}`);

    /**
     * Create path generator with smooth curves (rounded edges)
     */
    const pathGenerator = d3
      .line<DataPoint>()
      .x((d) => scales.x(d.key)!)
      .y((d) => scales.y(d.value))
      .curve(d3.curveMonotoneX);

    /**
     * Add, update and remove path element
     */
    pathContainer
      .selectAll("path")
      .data([data])
      .join(
        (enter) =>
          enter
            .append("path")
            .attr("fill", "none")
            .attr("stroke", lineColor)
            .attr("stroke-width", 1.5)
            .attr("d", pathGenerator as any)
            .attr("stroke-dasharray", 4000)
            .attr("stroke-dashoffset", 4000)
            .call((_enter) =>
              _enter
                .transition()
                .duration(ANIMATION_DURATION * 3)
                .attr("stroke-dashoffset", 0)
            ),
        (update) =>
          update
            .transition()
            .duration(ANIMATION_DURATION * 2)
            .attr("stroke-dashoffset", 0)
            .attrTween("d", function (d) {
              const previous = d3.select(this).attr("d");
              const current = pathGenerator(d) ?? "";
              return interpolatePath(previous, current);
            }),
        // .attr("d", pathGenerator as any),
        (exit) => exit.transition().attr("opacity", 0).remove()
      );

    pathContainer
      .selectAll("circle")
      .data<DataPoint>(data, (d) => (d as DataPoint).key)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("cx", (d) => scales.x(d.key)!)
            .attr("cy", (d) => scales.y(d.value))
            .attr("r", 4)
            .attr("fill", lineColor)
            .attr("opacity", 0)
            .call((_enter) =>
              _enter
                .transition()
                .duration(ANIMATION_DURATION * 2)
                .attr("opacity", 1)
            ),
        (update) =>
          update
            .transition()
            .duration(ANIMATION_DURATION * 2)
            .attr("cx", (d) => scales.x(d.key)!)
            .attr("cy", (d) => scales.y(d.value))
            .attr("opacity", 1),
        (exit) => exit.transition().attr("opacity", 0).remove()
      );
  }, [id, data, scales, lineColor]);

  return (
    <g
      id={id}
      style={{ transform: `translate(${MARGIN.left}px, ${MARGIN.top}px)` }}
    ></g>
  );
};

const ProfilePictures = ({
  yScale,
  data,
  svgWidth,
}: {
  yScale: Scales["y"];
  data: DataPoint[][];
  svgWidth: number;
}) => {
  const id = useId("profile-pictures");

  const lastDataPointForEachUser = useMemo(() => {
    return data
      .map((userData) => {
        return userData.at(0);
      })
      .filter(isDefined);
  }, [data]);

  useEffect(() => {
    const profilePicturesContainer = d3.selectAll(`#${id}`);

    profilePicturesContainer
      .selectAll("image")
      .data(lastDataPointForEachUser, (d) => (d as DataPoint).data.userId)
      .join(
        (enter) =>
          enter
            .append("image")
            .attr("xlink:href", (d) => d.data.user.image)
            .attr("x", svgWidth - MARGIN.right - PROFILE_PICTURE_SIZE - 10)
            .attr("y", (d) => yScale(d.value))
            .attr("height", PROFILE_PICTURE_SIZE)
            .attr("width", PROFILE_PICTURE_SIZE)
            .attr("opacity", 0)
            .call((_enter) =>
              _enter
                .transition()
                .duration(ANIMATION_DURATION * 2)
                .attr("opacity", 1)
            ),
        (update) =>
          update
            .transition("update image positions to match new data")
            .duration(ANIMATION_DURATION * 2)
            .attr("x", svgWidth - MARGIN.right - PROFILE_PICTURE_SIZE - 10)
            .attr("y", (d) => yScale(d.value)),
        (exit) => exit.transition().attr("opacity", 0).remove()
      );
  }, [lastDataPointForEachUser, id, svgWidth, yScale]);

  return <g id={id}></g>;
};

const Legend = ({
  profilePictureUrl,
  name,
  color,
}: {
  profilePictureUrl: string;
  name: string;
  color: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <img
        src={profilePictureUrl}
        alt="profile picture"
        width={PROFILE_PICTURE_SIZE}
        height={PROFILE_PICTURE_SIZE}
        className={`rounded border-2`}
        style={{ borderColor: color }}
      />
      <span>{name}</span>
    </div>
  );
};
