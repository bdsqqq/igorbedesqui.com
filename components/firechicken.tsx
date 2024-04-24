import StyledLink from "@/ui/StyledLink";

export default function FireChicken() {
  return (
    <div className="inline-flex w-full flex-wrap justify-end gap-1 text-right">
      <StyledLink
        className="whitespace-nowrap"
        iconless
        href="https://firechicken.club"
      >
        Fire Chicken Webring
      </StyledLink>
      <span className="text-gray-09 inline-flex justify-end gap-0.5">
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
