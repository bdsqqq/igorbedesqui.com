export const fade = keyframes({
  from: { opacity: 0 },
  to: { opacity: "100%" },
});

export const scaleIn = keyframes({
  "0%": { opacity: 0, transform: "scale(0)" },
  "100%": { opacity: 1, transform: "scale(1)" },
});

export const scaleOut = keyframes({
  "0%": { opacity: 1, transform: "scale(1)" },
  "100%": { opacity: 0, transform: "scale(0)" },
});

export const slideDown = keyframes({
  "0%": { opacity: 0, transform: "translateY(-5px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

export const slideUp = keyframes({
  "0%": { opacity: 0, transform: "translateY(5px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

export const scaleInSlideDown = keyframes({
  "0%": { opacity: 0, transform: "scale(0) translateY(-5px)" },
  "100%": { opacity: 1, transform: "scale(1) translateY(0)" },
});

export const scaleInSlideUp = keyframes({
  "0%": { opacity: 0, transform: "scale(0) translateY(5px)" },
  "100%": { opacity: 1, transform: "scale(1) translateY(0)" },
});

export const scaleOutSlideDown = keyframes({
  "0%": { opacity: 1, transform: "scale(1) translateY(0)" },
  "100%": { opacity: 0, transform: "scale(0) translateY(-5px)" },
});

export const scaleOutSlideUp = keyframes({
  "0%": { opacity: 1, transform: "scale(1) translateY(0)" },
  "100%": { opacity: 0, transform: "scale(0) translateY(5px)" },
});

/**
 * See: https://carbondesignsystem.com/guidelines/motion/overview/
 */
export const timingFunction = {
  productive: {
    standard: "cubic-bezier(0.2, 0, 0.38, 0.9)",
    entrance: "cubic-bezier(0, 0, 0.38, 0.9)",
    exit: "cubic-bezier(0.2, 0, 1, 0.9)",
  },
  expressive: {
    standard: "cubic-bezier(0.4, 0.14, 0.3, 1)",
    entrance: "cubic-bezier(0, 0, 0.3, 1)",
    exit: "cubic-bezier(0.4, 0.14, 1, 1)",
  },
};

/**
 * fast-01 - 70ms - Micro-interactions such as button and toggle
 *
 * fast-02 - 110ms - Micro-interactions such as fade
 *
 * moderate-01 - 150ms - Micro-interactions, small expansion, short distance movements
 *
 * moderate-02 - 240ms - Expansion, system communication, toast
 *
 * slow-01 - 400ms - Large expansion, important system notifications
 *
 * slow-02 - 700ms - Background dimming
 *
 * See: https://carbondesignsystem.com/guidelines/motion/overview/
 */
export const duration = {
  fast01: "70ms",
  fast02: "110ms",
  moderate01: "150ms",
  moderate02: "240ms",
  slow01: "400ms",
  slow02: "700ms",
};

import { keyframes } from "stitches.config";
