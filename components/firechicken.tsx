import StyledLink from "@/ui/StyledLink";

export default function FireChicken() {
  return (
    <div className="inline-flex gap-1">
      <StyledLink iconless href="https://firechicken.club">
        Fire Chicken Webring
      </StyledLink>
      <span className="inline-flex gap-0.5 text-gray-9">
        (
        <StyledLink iconless href="https://firechicken.club/igor/prev">
          prev
        </StyledLink>
        /
        <StyledLink iconless href="https://firechicken.club/igor/next">
          next
        </StyledLink>
        )
      </span>
    </div>
  );
}
