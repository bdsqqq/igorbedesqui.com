import { UnstyledLink } from "@/components/ui/primitives";
import StyledLink from "@/ui/StyledLink";

export default function FireChicken() {
  return (
    <div className="flex gap-1">
      <UnstyledLink href="https://firechicken.club/igor/prev">←</UnstyledLink>
      <StyledLink href="https://firechicken.club">
        Fire Chicken Webring
      </StyledLink>
      <UnstyledLink href="https://firechicken.club/igor/next">→</UnstyledLink>
    </div>
  );
}
