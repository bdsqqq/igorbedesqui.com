import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
interface HoverCard {
  content: React.ReactNode;
  dark?: boolean;
}

const HoverCard: React.FC<HoverCard> = ({ children, content, dark }) => (
  <HoverCardPrimitive.Root openDelay={200} closeDelay={100}>
    <HoverCardPrimitive.Trigger>{children}</HoverCardPrimitive.Trigger>
    <HoverCardContent
      side="top"
      className={`relative p-4 w-64 rounded-sm shadow-md border ${
        !dark
          ? "bg-sand-sand3 text-sand-sand12 border-sand-sand7"
          : "bg-sandDark-sand3 text-sandDark-sand12 border-sandDark-sand7"
      }`}
    >
      {content}
      <HoverCardPrimitive.Arrow
        className={`fill-current filter drop-shadow stroke-1 ${
          !dark
            ? "text-sand-sand3 stroke-sand-sand7"
            : "text-sandDark-sand3 stroke-sandDark-sand7"
        }`}
      />
    </HoverCardContent>
  </HoverCardPrimitive.Root>
);

export default HoverCard;

const scaleIn = keyframes({
  "0%": { opacity: 0, transform: "scale(0)" },
  "100%": { opacity: 1, transform: "scale(1)" },
});

const scaleOut = keyframes({
  "0%": { opacity: 1, transform: "scale(1)" },
  "100%": { opacity: 0, transform: "scale(0)" },
});

const slideDown = keyframes({
  "0%": { opacity: 0, transform: "translateY(-5px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideUp = keyframes({
  "0%": { opacity: 0, transform: "translateY(5px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const HoverCardContent = styled(HoverCardPrimitive.Content, {
  '&[data-side="top"]': { animationName: slideUp, scaleIn },
  '&[data-side="bottom"]': { animationName: slideDown, scaleIn },

  '&[data-state="closed"]': {
    animationName: scaleOut,
    animationTimingFunction: "cubic-bezier(0.2, 0, 1, 0.9)",
  },

  animationDuration: "0.15s",
  animationTimingFunction: "cubic-bezier(0, 0, 0.38, 0.9)",

  transformOrigin: "var(--radix-hover-card-content-transform-origin)",
});

import { styled, keyframes } from "@stitches/react";
