import { colors } from "@/constants/colors";
import React from "react";
import { G, Line, LineProps } from "react-native-svg";

interface HorizontalProps {
  numberOfTicks?: number;
  y?: any;
  svg?: Partial<LineProps>;
}

const Horizontal = ({ numberOfTicks = 10, y, svg }: HorizontalProps) => {
  const ticks = y.ticks(numberOfTicks);

  return (
    <G>
      {ticks.map((tick: any) => (
        <Line
          key={tick}
          x1={"0%"}
          x2={"100%"}
          y1={y(tick)}
          y2={y(tick)}
          strokeWidth={1}
          stroke={"rgba(0,0,0,0.2)"}
          strokeOpacity={0.2}
          {...svg}
        />
      ))}
    </G>
  );
};

interface VerticalProps {
  numberOfTicks?: number;
  x?: any;
  svg?: Partial<LineProps>;
}

const Vertical = ({ numberOfTicks = 10, x, svg }: VerticalProps) => {
  const ticks = x.ticks(5);

  return (
    <G>
      {ticks.map((tick: any) => {
        return (
          <Line
            key={tick}
            y1={"0%"}
            y2={"100%"}
            x1={x(tick)}
            x2={x(tick)}
            strokeWidth={1}
            strokeOpacity={0.2}
            // stroke={"rgba(0,0,0,0.2)"}
            {...svg}
          />
        );
      })}
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

export const Grid = ({
  direction = "both",
  belowChart = true,
  svg = {
    stroke: colors.secondary[200],
  },
  ...props
}: GridProps) => {
  if (direction === "vertical") {
    return <Vertical {...props} svg={svg} />;
  } else if (direction === "horizontal") {
    return <Horizontal {...props} svg={svg} />;
  } else if (direction === "both") {
    return <Both {...props} svg={svg} />;
  }

  return null;
};
