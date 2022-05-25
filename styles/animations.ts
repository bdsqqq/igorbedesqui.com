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



import { keyframes } from "stitches.config";
