import React from "react";
import { G, Line, LineProps } from "react-native-svg";

interface HorizontalProps {
  ticks?: Array<any>;
  y?: Function;
  svg?: Partial<LineProps>;
}

const Horizontal = ({
  ticks = [],
  y = (tick: any) => tick,
  svg,
}: HorizontalProps) => {
  return (
    <G>
      {ticks.map((tick) => (
        <Line
          key={tick}
          x1={"0%"}
          x2={"100%"}
          y1={y(tick)}
          y2={y(tick)}
          strokeWidth={1}
          stroke={"rgba(0,0,0,0.2)"}
          {...svg}
        />
      ))}
    </G>
  );
};

interface VerticalProps {
  ticks?: Array<any>;
  x?: Function;
  svg?: Partial<LineProps>;
}

const Vertical = ({
  ticks = [],
  x = (tick: any) => tick,
  svg,
}: VerticalProps) => {
  return (
    <G>
      {ticks.map((tick, index) => (
        <Line
          key={index}
          y1={"0%"}
          y2={"100%"}
          x1={x(tick)}
          x2={x(tick)}
          strokeWidth={1}
          stroke={"rgba(0,0,0,0.2)"}
          {...svg}
        />
      ))}
    </G>
  );
};

interface BothProps extends HorizontalProps, VerticalProps {}

const Both = (props: BothProps) => {
  return (
    <G>
      <Horizontal {...props} />
      <Vertical {...props} />
    </G>
  );
};

export type Direction = "vertical" | "horizontal" | "both";

interface GridProps extends BothProps {
  direction?: Direction;
  belowChart?: boolean;
}

export const Grid = ({ direction, belowChart = true, ...props }: GridProps) => {
  if (direction === "vertical") {
    return <Vertical {...props} />;
  } else if (direction === "horizontal") {
    return <Horizontal {...props} />;
  } else if (direction === "both") {
    return <Both {...props} />;
  }

  return null;
};
