export default function Page() {
  return (
    <Container backable backAnchor="/writing">
      <Band id="01" gridless>
        <div className="max-w-prose mx-auto space-y-4">
          <h1 className="text-2xl text-gray-12 mb-8">{meta.name}</h1>
          <p>
            {`What good design and getting you and your friends to gold in league in a week have in common?`}
          </p>
          <p>
            {`Both require focusing on basic principles to avoid stupid mistakes.`}{" "}
            <em className="text-gray-12">
              {`Being smart, creative, and innovative is important, but ignoring the risks that come with it is irresponsible; Allowing yourself to make big mistakes is an inherent part of the creative process.`}
            </em>
          </p>
          <p>
            {`But I digress, I’m not here to talk about innovation,`}{" "}
            <em className="text-gray-12">
              {`this is about the often undervalued simple approach`}
            </em>
            {`. Despite the popularity of minimalism and the general idea that "`}
            <StyledLink href="https://www.goodreads.com/quotes/19905-perfection-is-achieved-not-when-there-is-nothing-more-to">
              {`perfection is achieved when there is nothing left to take away`}
            </StyledLink>
            {`", `}
            <em className="text-gray-12">{`we often downplay the value of the basics in various disciplines by using the word "just"`}</em>
            {`.`}
          </p>
          <p>
            {`In one of my favorite books, "Zen and the Art of Motorcycle Maintenance", the author discusses this concept, arguing that`}{" "}
            <em className="text-gray-12">{`by removing “just” from our language, we can better understand and accept the true meaning of sentences`}</em>{" "}
            {`; “Just the basics” becomes “the fundamentals”.`}{" "}
          </p>
          <p>
            <em className="text-gray-12">
              {`The consistent execution of fundamentals builds the foundation that serves as a safety net to allow innovation in the long term.`}
            </em>
          </p>

          <p className="pt-4">
            {`Now, `}
            <em className="text-gray-12">
              {`I'm focusing on the basics of my craft. The fine and detailed polish I strive for will come as I build “Just” the basics with care.`}{" "}
            </em>
            <span aria-hidden="true" className="text-transparent">
              I hope...
            </span>
          </p>

          <div
            id="Why_are_you_looking_here?"
            className="hidden"
            aria-hidden="true"
          >
            <p>
              {`
                With the important concept out of the way, it's time to talk about silly games.
              `}
            </p>
            <p>
              {`
                For a long time I played League with my friends, and this year, despite not being good at the game, we tried to climb the competitive ranks less than a month before the end of the season. The strategy I chose and forced my friends to adopt was repeating the phrase “Just the basic” every couple of seconds as a meme and actually executing just the basics in the game, nothing fancy other than trying to not make mistakes. In the 10 games I played, we won 9; In an incredibly scientific effort, I stopped playing with them and saw the win streak end, it seems like there was a direct relation between playing a simple game of fundamentals and the statistical anomaly of a 90% win rate. If you came here for League tips: don’t die, farm well, and focus on objectives; Getting enough of an advantage will allow you to risk making mistakes.
              `}
            </p>
          </div>
        </div>
      </Band>
    </Container>
  );
}

export const meta = {
  shortName: "not “just” the basics",
  name: "Not “just” the basics",
  description: "What climbing the ranks of a game taught me about design",
  date: "21/12/2022",
  urlSlug: "not-just-the-basics",
  backMessage: "",
};

import Band from "@/components/Band";
import Container from "@/components/Container";
import StyledLink from "@/components/ui/StyledLink";
