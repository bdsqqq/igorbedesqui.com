const Footer = () => {
  const { t } = useTypeSafeTranslation("common");

  return (
    <div className="flex justify-center w-full bg-mauve1 text-mauve12">
      <div className="max-w-6xl px-10 w-full">
        <Separator className="w-11 my-8" />
        <footer className="pb-16">
          <div className="grid gap-y-8 gap-x-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="[grid-column:1_/_-1] lg:[grid-column:auto]">
              <StyledLink className="no-underline" href="/">
                Igor Bedesqui
              </StyledLink>
            </div>

            {/*
            <div>
            <h6 className="font-semibold">Me</h6> 
            <ul>
            <li className="mt-2">About</li>
            <li className="mt-2">Now</li>
          </ul>
          </div>

          <div>
          <h6 className="font-semibold">Work</h6>
          <ul>
            <li className="mt-2">Projects</li>
            <li className="mt-2">Resume</li>
          </ul>
          </div> */}

            <div>
              <h6 className="font-semibold">{t("footer.connect")}</h6>
              <ul>
                <li className="mt-2">
                  <StyledLink bold={false} href="https://github.com/bdsqqq/">
                    Github
                  </StyledLink>
                </li>
                <li className="mt-2">
                  <StyledLink bold={false} href="https://twitter.com/bedesqui">
                    Twitter
                  </StyledLink>
                </li>
                <li className="mt-2">
                  <StyledLink
                    bold={false}
                    href="https://www.linkedin.com/in/igor-bedesqui/"
                  >
                    Linkedin
                  </StyledLink>
                </li>
                <li className="mt-2">
                  <EmailLink>
                    <span
                      style={{
                        fontWeight: 400,
                      }}
                    >
                      Email
                    </span>
                  </EmailLink>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;

import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";

import { Box, Separator } from "@/ui/primitives";
import StyledLink from "@/ui/StyledLink";
import EmailLink from "./ui/EmailLink";
