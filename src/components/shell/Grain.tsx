import { useEffect, useRef } from "react";

import framernoiseUrl from "./-framernoise.png";

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

    /**
     * @bdsqqq @ 2026-03-22T23:13
     * I thought it was bad to use js to animate the grain,
     * so I tested doing it with css keyframes, it was about 10x slower.
     * sooooo, yea.
     */
    const interval = setInterval(() => {
      grain.style.transform = `translateX(${
        keyframesX[i % keyframesX.length]
      }) translateY(${keyframesY[i % keyframesY.length]})`;

      i++;
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 h-full w-full overflow-hidden">
      <div
        ref={grainRef}
        className="absolute inset-[-200%] h-[400%] w-[400%] bg-size-[256px] bg-top-left opacity-3"
        /**
         * @bdsqqq @ 2026-03-22T23:13
         * I thought it was bad to use a static image for the grain,
         * and while I have more control with an svg feTurbulence,
         * it introduces annoying clipping behaviour; the browser
         * tries to NOT render tiles outside of the viewport, but since
         * we animate translations, we're taking tiles in and out faster
         * than the browser can keep up with, so we end up with big squares
         * of blank space. Can explore again later, but worth the comment
         */
        style={{ backgroundImage: `url(${framernoiseUrl})` }}
      />
    </div>
  );
};
