import { useEffect } from "react";
import * as d3 from "d3";
import { useId } from "../../../hooks/useId";

export const XAxis = ({
  xScale,
  x = 0,
  y = 0,
}: {
  xScale: d3.AxisScale<string>;
  x?: number;
  y?: number;
}) => {
  const id = useId("x-axis");

  useEffect(() => {
    const xAxis = d3.axisBottom(xScale);
    d3.select(`#${id}`).call(xAxis as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const xAxis = d3.axisBottom(xScale);
    d3.select(`#${id}`)
      .transition()
      .call(xAxis as any);
  }, [id, xScale]);

  return (
    <g
      id={id}
      className="x-axis"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    />
  );
};

export const YAxis = ({
  yScale,
  x = 0,
  y = 0,
}: {
  yScale: d3.AxisScale<d3.NumberValue>;
  x?: number;
  y?: number;
}) => {
  const id = useId("y-axis");

  useEffect(() => {
    const yAxis = d3.axisLeft(yScale);
    d3.select(`#${id}`).call(yAxis as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const yAxis = d3.axisLeft(yScale);
    d3.select(`#${id}`)
      .transition()
      .call(yAxis as any);
  }, [id, yScale]);

  return (
    <g
      id={id}
      className="y-axis"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    />
  );
};
