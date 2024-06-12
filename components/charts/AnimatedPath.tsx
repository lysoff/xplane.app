import React, { useEffect, useRef, useState } from "react";
import { InteractionManager } from "react-native";
import { Path, PathProps } from "react-native-svg";
import * as interpolate from "d3-interpolate-path";
import { runOnJS } from "react-native-reanimated";

interface AnimatedPathProps extends PathProps {
  animate: boolean;
  animationDuration: number;
}

const AnimatedPath = (props: AnimatedPathProps) => {
  const { d: _d = "", animate, animationDuration } = props;

  const [d, setD] = useState(_d || "");

  const animationRef = useRef(0);
  const handleRef = useRef<number | null>(null);
  const interpolateRef = useRef<(t: number) => string>();
  const pathRef = useRef(null);

  useEffect(() => {
    if (!animate || d === null || _d === null) {
      return;
    }

    interpolateRef.current = interpolate.interpolatePath(d, _d);

    _animate(0);

    return () => {
      cancelAnimationFrame(animationRef.current);
      _clearInteraction();
    };
  }, [_d]);

  const _animate = (start: number) => {
    cancelAnimationFrame(animationRef.current);

    animationRef.current = requestAnimationFrame((timestamp) => {
      if (!start) {
        _clearInteraction();
        handleRef.current = InteractionManager.createInteractionHandle();

        start = timestamp;
      }

      // Get the delta on how far long in our animation we are.
      const delta = (timestamp - start) / animationDuration;

      // If we're above 1 then our animation should be complete.
      if (delta > 1) {
        // Just to be safe set our final value to the new graph path.
        // this.component.setNativeProps({ d: this.newD });
        runOnJS(setD)(_d);
        // Stop our animation loop.
        _clearInteraction();
        return;
      }

      if (interpolateRef.current) {
        const d = interpolateRef.current(delta);
        // this.component.setNativeProps({ d });
        runOnJS(setD)(d);

        // this.setState(this.state, () => {
        //   this._animate(start);
        // });
        InteractionManager.runAfterInteractions(() => _animate(start));
      }
      // console.log(this.interpolator)
      // this.tween && console.log(this.tween.tween(delta))
      // Tween the SVG path value according to what delta we're currently at.

      // Update our state with the new tween value and then jump back into
      // this loop.
    });
  };

  const _clearInteraction = () => {
    if (handleRef.current) {
      InteractionManager.clearInteractionHandle(handleRef.current);
      handleRef.current = null;
    }
  };

  return <Path ref={pathRef} {...props} d={props.animate ? d : _d} />;
};

export default AnimatedPath;
