"use client";

import * as React from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/utils";

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  /**
   * Speed in seconds for one full loop.
   * (Matches the component snippet you provided.)
   */
  speed?: number;
  /**
   * Speed in seconds while hovering.
   */
  speedOnHover?: number;
  /**
   * Prefer using speed/speedOnHover; these are supported for flexibility.
   */
  duration?: number;
  durationOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 16,
  speed,
  speedOnHover,
  duration,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const baseDuration = duration ?? speed ?? 25;
  const hoverDuration = durationOnHover ?? speedOnHover;

  const [currentDuration, setCurrentDuration] = React.useState(baseDuration);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    let controls: ReturnType<typeof animate> | undefined;

    const size = direction === "horizontal" ? width : height;
    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: "linear",
        duration: currentDuration * Math.abs((translation.get() - to) / contentSize),
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prev) => prev + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: "linear",
        duration: currentDuration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from);
        },
      });
    }

    return () => controls?.stop();
  }, [key, translation, currentDuration, width, height, gap, isTransitioning, direction, reverse]);

  const hoverProps =
    typeof hoverDuration === "number"
      ? {
          onHoverStart: () => {
            setIsTransitioning(true);
            setCurrentDuration(hoverDuration);
          },
          onHoverEnd: () => {
            setIsTransitioning(true);
            setCurrentDuration(baseDuration);
          },
        }
      : {};

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        className="flex w-max"
        style={{
          ...(direction === "horizontal" ? { x: translation } : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        ref={ref}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}


