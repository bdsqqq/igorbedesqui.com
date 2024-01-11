const Footer = () => {
  return (
    <div className="relative z-aboveVignette w-full px-8 md:px-16">
      <div className="mx-auto w-full md:max-w-7xl">
        <div
          className="col-span-16 h-px w-full"
          style={{
            background:
              "radial-gradient(ellipse at center, var(--color-gray-7) 0%, var(--color-gray-1) 75%, transparent 100%)",
          }}
        />
        <footer
          className={cn(
            subGrid({
              lg: 16,
              md: 8,
              sm: 4,
            })(),
            "py-8"
          )}
        >
          {/* <div className="grid grid-cols-2 gap-y-8 gap-x-2 md:grid-cols-3 lg:grid-cols-4"> */}
          {/* <Separator className="col-span-16 my-8 w-11" /> */}

          <div className="col-span-2 col-start-1 md:col-span-4">
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

          {/* <div>
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
            </div> */}

          <div className="col-span-2 md:col-span-4 md:col-end-9 lg:col-span-8 lg:col-end-17">
            <FireChicken />
          </div>
          <div />
        </footer>
      </div>
    </div>
  );
};

export default Footer;

import { Separator } from "@/ui/Separator";
import StyledLink from "@/ui/StyledLink";
import FireChicken from "@/components/firechicken";
import { subGrid } from "@/components/ui/Grid";
import { cn } from "@/lib/styling";
