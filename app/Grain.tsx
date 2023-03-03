"use client";

import { useEffect, useRef } from "react";

export const Grain = () => {
  const grainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grain = grainRef.current;
    if (!grain) return;

    const keyframesX = [
      "0%",
      "-5%",
      "-15%",
      "7%",
      "-5%",
      "-15%",
      "15%",
      "0%",
      "3%",
      "-10%",
    ];
    const keyframesY = [
      "0%",
      "-10%",
      "5%",
      "-25%",
      "25%",
      "10%",
      "0%",
      "15%",
      "35%",
      "10%",
    ];
    let i = 0;

    const interval = setInterval(() => {
      grain.style.transform = `translateX(${
        keyframesX[i % keyframesX.length]
      }) translateY(${keyframesY[i % keyframesY.length]})`;

      i++;
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none z-40 fixed w-full h-full inset-0 overflow-hidden">
      <div
        ref={grainRef}
        className="absolute inset-[-200%] w-[400%] h-[400%] bg-[url('/images/framernoise.png')] bg-left-top bg-[length:256px] opacity-[3%]"
      />
    </div>
  );
};
