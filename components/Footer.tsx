const Footer = () => {
  return (
    <div className="w-full px-8 md:px-16">
      <div className="mx-auto w-full py-10 md:max-w-7xl">
        <Separator className="my-8 w-11" />
        <footer className="pb-16">
          <div className="grid grid-cols-2 gap-y-8 gap-x-2 md:grid-cols-3 lg:grid-cols-4">
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
              <h6 className="font-semibold">Connect</h6>
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

import { Separator } from "@/ui/primitives";
import StyledLink from "@/ui/StyledLink";
import EmailLink from "./ui/EmailLink";
