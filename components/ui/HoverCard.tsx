import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
interface HoverCard {
  content: React.ReactNode;
  dark?: boolean;
}

const HoverCard: React.FC<HoverCard> = ({ children, content, dark }) => (
  <HoverCardPrimitive.Root>
    <HoverCardPrimitive.Trigger>{children}</HoverCardPrimitive.Trigger>
    <HoverCardPrimitive.Content
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
    </HoverCardPrimitive.Content>
  </HoverCardPrimitive.Root>
);

export default HoverCard;
