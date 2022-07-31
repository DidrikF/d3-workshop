import React, { useMemo } from "react";
import { max } from "d3-array";
import * as curveType from "@visx/curve";
import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import { scalePoint, scaleLinear } from "@visx/scale";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import useHistoryData from "../../data-hooks/useHistoryData";
import { ScoreWithUser, UserData } from "../../data-hooks/types";
import { range } from "lodash";
import { AxisRight, AxisBottom } from "@visx/axis";
import { interpolateSinebow, ScaleLinear, ScalePoint } from "d3";

const MARGIN = {
  top: 20,
  right: 80,
  bottom: 50,
  left: 100,
};

type Scales = {
  x: ScalePoint<number>;
  y: ScaleLinear<number, number, never>;
};

const VisxChart = () => {
  const [size, containerRef] = useResizeObserver();
  const data = useHistoryData();

  return (
    <div className="flex flex-col items-center">
      <div
        ref={containerRef}
        className="relative inline w-fill w-[800px] h-[600px]"
      >
        {size && data.length > 0 && (
          <VisxLineChart
            data={data}
            svgWidth={size.width}
            svgHeight={size.height}
          />
        )}
      </div>
    </div>
  );
};

export default VisxChart;

const getY = (d: ScoreWithUser) => d.value;

const VisxLineChart = ({
  data,
  svgWidth,
  svgHeight,
}: {
  data: UserData[];
  svgWidth: number;
  svgHeight: number;
}) => {
  const width = svgWidth - MARGIN.left - MARGIN.right;
  const height = svgHeight - MARGIN.top - MARGIN.bottom;

  const scale: Scales = useMemo(
    () => ({
      x: scalePoint({
        domain: range(10, -1),
        range: [0, width],
      }),
      y: scaleLinear({
        domain: [0, max(data, (user) => max(user.Score, (d) => d.value)) ?? 0],
        range: [height, 0],
      }),
    }),
    [data, width, height]
  );

  return (
    <svg width={svgWidth} height={svgHeight} className="visx-chart">
      <AxisBottom
        scale={scale.x}
        top={svgHeight - MARGIN.bottom}
        left={MARGIN.left}
      />
      <AxisRight
        scale={scale.y}
        top={MARGIN.top}
        left={svgWidth - MARGIN.right}
      />

      {data.map((user, userIndex) => {
        return (
          <Group key={user.id} top={MARGIN.top} left={MARGIN.left}>
            {user.Score.map((d, i) => (
              <circle
                key={d.id}
                r={3}
                cx={scale.x(i + 1) ?? 0}
                cy={scale.y(getY(d)) ?? 0}
                fill={interpolateSinebow(userIndex / data.length)}
              />
            ))}

            <LinePath
              key={user.id}
              curve={curveType["curveCatmullRom"]}
              data={user.Score}
              x={(_: ScoreWithUser, i: number) => scale.x(i + 1) ?? 0}
              y={(d: ScoreWithUser) => scale.y(getY(d)) ?? 0}
              stroke={interpolateSinebow(userIndex / data.length)}
              strokeWidth={1}
            />
          </Group>
        );
      })}
    </svg>
  );
};
