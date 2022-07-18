import { useEffect, useMemo, useState } from "react";
import { trpc } from "../../../utils/trpc";
import * as d3 from "d3";
import { useResizeObserver } from "../../../hooks/useResizeObserver";
import { useId } from "../../../hooks/useId";
import { usePusherChannel, usePusherEvent } from "../../../utils/pusher";
import { XAxis, YAxis } from "../chart-utils/Axis";

const T_REX_GAME_CHANNEL_ID = "t-rex-game";
enum TRexGameEvent {
  ScoreAdded = "score-added",
}

export const MyHistoryChart = () => {
  const [size, containerRef] = useResizeObserver();

  const [newScores, setNewScores] = useState<BarData[]>([]);
  const channel = usePusherChannel(T_REX_GAME_CHANNEL_ID);
  usePusherEvent<{ userId: string; value: number }>(
    channel,
    TRexGameEvent.ScoreAdded,
    (score) => {
      console.log("score-added message: ", score);
      setNewScores((scores) => [
        ...scores,
        { key: `new-${scores.length}`, value: score.value },
      ]);
    }
  );

  const previousScores = trpc.useQuery(["game.yourScores"], {
    enabled: !!channel,
  });

  const data = useMemo(() => {
    return [
      ...(previousScores.data?.map((score, index) => ({
        key: `previous-${index}`,
        value: score.value,
      })) ?? []),
      ...newScores,
    ];
  }, [previousScores, newScores]);

  return (
    <>
      <h2>Your scores</h2>
      <div ref={containerRef} className="relative w-fill w-px-800 h-96">
        {size && (
          <BarChart data={data} width={size.width} height={size.height} />
        )}
      </div>
    </>
  );
};

const MARGIN = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 40,
};

type BarData = {
  key: string;
  value: number;
};

const BarChart = ({
  data,
  width,
  height,
}: {
  data: BarData[];
  width: number;
  height: number;
}) => {
  const id = useId("bar-chart");

  const scales = useMemo(() => {
    return {
      x: d3
        .scaleBand()
        .domain(data.map((d) => d.key))
        .range([MARGIN.left, width - MARGIN.right])
        .padding(0.2),
      y: d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value) ?? 0])
        .range([height - MARGIN.bottom, MARGIN.top]),
    };
  }, [data, width, height]);

  useEffect(() => {
    console.log(data);
    d3.select(`#${id}`).attr("width", width).attr("height", height);

    d3.select(`#${id} .data-container`)
      .selectAll("rect")
      .data(data, (d) => (d as BarData).key)
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("rx", 2)
            .attr("fill", (d) => "white")
            .attr("x", (d) => scales.x(d.key)!!)
            .attr("width", scales.x.bandwidth())
            .attr("y", (d) => height - MARGIN.bottom)
            .attr("height", 0)
            .call((_enter) =>
              _enter
                .transition("grow bar height with chained transitions")
                .duration(250)
                .attr("y", (d) => scales.y(d.value)!!)
                .attr(
                  "height",
                  (d) => height - MARGIN.bottom - scales.y(d.value)!!
                )
            ),
        (update) =>
          update
            .transition("update bars to match new data")
            .duration(250)
            .attr("x", (d) => scales.x(d.key)!!)
            .attr("width", scales.x.bandwidth())
            .attr("y", (d) => scales.y(d.value)!!)
            .attr(
              "height",
              (d) => height - MARGIN.bottom - scales.y(d.value)!!
            ),
        (exit) => exit.transition().attr("opacity", 0).remove()
      );
  }, [id, data, scales, height, width]);

  return (
    <svg id={id} xmlns="http://www.w3.org/2000/svg" className="absolute">
      <XAxis xScale={scales.x} y={height - MARGIN.bottom} />
      <YAxis yScale={scales.y} x={MARGIN.left} />
      <g className="data-container"></g>
    </svg>
  );
};

function tickFormat(value: string) {
  return value;
}
