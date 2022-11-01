export default function Iss() {
  const { t, lang } = useTypeSafeTranslation("projs/iss");
  const issMeta = useMeta("iss", "projs");
  const wasmGifMeta = useMeta("wasmGif", "projs");
  return (
    <>
      <Seo
        title="Where's the ISS?"
        description="A simple webapp that tells you where is the International Space Station — made by Igor Bedesqui"
        url="p/iss"
      />

      <ProjectContainer key="issProj" backMessage="Fly back home">
        <HeroBand fullBleed heroVideo="/videos/iss/space">
          <TransWithComps text={t("heroTitle")} />
          <p className="text-transparent" aria-hidden="true">
            {t("heroSubHead")}
          </p>
          <div className="mt-6">
            <CodeAndDemoButtons
              codeUrl="https://github.com/bdsqqq/iss-asset"
              demoUrl="https://iss.igorbedesqui.com/"
            />
          </div>
        </HeroBand>

        <ProjectLayout projMeta={issMeta} nextProjMeta={wasmGifMeta}>
          <Band headline={{ bold: "01", thin: t("01Thin") }}>
            <p>
              A few years ago, I fell in love with coding by watching
              <StyledLinkWithIcon href="https://www.youtube.com/c/TheCodingTrain">
                {` Daniel Shiffman's youtube channel`}
              </StyledLinkWithIcon>
              . Following{" "}
              <StyledLinkWithIcon href="https://www.youtube.com/watch?v=DbcLg8nRWEg&list=PLRqwX-V7Uu6YxDKpFzf_2D84p0cyk4T7X">
                his series about Data and APIs
              </StyledLinkWithIcon>{" "}
              I created the website that got me my first job interview. This
              project is an update for that website and a lesson on
              prioritizing. What started as me trying to replicate the complex
              layout and features of an asset I helped deploy on ibm.com but
              quickly transformed into a side project that reflects the quality
              of the work I strive to do. Instead of adding as many animations,
              features, and info as possible, I focused on delivering the
              content in a simple and beautiful way.
            </p>
          </Band>
          <Band headline={{ bold: "02", thin: "challenges" }}>
            <h4 className="text-xl mb-4 font-bold">Request limitations</h4>
            <p>
              {`
                Using data from a third-party API, I had a couple of limitations; especifically, I could only make one request per second across all clients. Without a caching layer of some sort, a few concurrent users, would quickly exceed my quota. This called for an interesting solution;
              `}{" "}
              <span
                style={{
                  textDecoration: "line-through",
                }}
              >
                {`creating a serverless cache layer to store fresh data and distribute it or refresh it when appropriate is something I never did before but had fun implementing. Using a blazing fast cache like Redis on`}{" "}
                <StyledLinkWithIcon href="https://upstash.com/">
                  Upstash
                </StyledLinkWithIcon>
                {` allowed me to deliver an almost instant experience to users while keeping the number of requests to an external API in check.`}
                <br />
                <br />
                {`While server-side challenges are something I don't deal with that much, this one proved to be a valuable learning experience and taught me a pattern that I'm sure I'll use in the future.`}
              </span>
              <br />
              <br />
              <p>
                {`
                  So, about the paragraphs above, what the fuck was I thinking??? I spun up a full-on Redis service to cache a REQUEST THAT DOESN'T CHANGE BETWEEN USERS.
                `}
                <br />
                <br />
                {`
                  The current solution is a SMALLER serverless function that runs faster and is cached on Vercel's EDGE. Supported by a better fetching logic on the frontend, this site should be able to handle any load and update the ISS location as fast as the API allows.
                `}
              </p>
            </p>

            <h4 className="text-xl mb-4 font-bold">Incremental enhacement</h4>
            <p>
              {`A frosted-glass look was a constant during my experiments, though some browsers didn't support the properties needed for it.`}
              <br />
              {`To keep the experience I wanted for users with cutting-edge browsers without sacrificing the experience for anyone, I leveraged the "@supports" media query to make the blur effect an incremental enhancement.`}
              <br />
              <br />
              <div className="grid grid-cols-2 gap-1 my-2">
                <figure className="col-start-1">
                  <div className="rounded-sm overflow-hidden">
                    <Image
                      layout="responsive"
                      width="100%"
                      height="100%"
                      objectFit="contain"
                      src="/images/projs/iss/blur.png"
                      alt=""
                    />
                  </div>
                  <figcaption>
                    <span className="text-sm italic tracking-wide text-mauve11 inline-block text-center mt-1">
                      {`The UI in browsers that support filter properties blurs elements behind it.`}
                    </span>
                  </figcaption>
                </figure>
                <figure className="col-start-2">
                  <div className="rounded-sm overflow-hidden">
                    <Image
                      layout="responsive"
                      width="100%"
                      height="100%"
                      objectFit="contain"
                      src="/images/projs/iss/no_blur.png"
                      alt=""
                    />
                  </div>

                  <figcaption>
                    <span className="text-sm italic tracking-wide text-mauve11 inline-block text-center mt-1">
                      {`While the UI in browsers that don't support filters, fallbacks into a solid color.`}
                    </span>
                  </figcaption>
                </figure>
              </div>
              <br />
              {`This feature might be a small detail, but an easy win from an "Oh! that's cool" perspective is always welcome.`}
            </p>
          </Band>
          <Band headline={{ bold: "03", thin: "Results" }}>
            <figure className="rounded-sm overflow-hidden mb-4">
              <Image
                layout="responsive"
                width="59%"
                height="100%"
                objectFit="contain"
                src="/images/projs/iss/full_screenshot.png"
                alt="Website screenshot"
              />
            </figure>
            <p>
              {`Through the literal years of development, this project saw my preferred solutions and approaches changing; Now, much more than a love letter to someone who shaped my early development, this site became a time capsule of my growth.`}
              <br />
              {`This tiny piece of user experience—load page, see location—was an opportunity to learn, practice, and experiment. And I can't wait to see how I'll rebuild it years from now.`}
              <br />
              <br />
              {`If you want to see me losing my mind, changing scope, and having
              fun, look at the `}
              <StyledLinkWithIcon href="https://github.com/bdsqqq/iss-asset/commits/main">
                {`project's commit history`}
              </StyledLinkWithIcon>{" "}
              And to see the actual site, visit{" "}
              <StyledLinkWithIcon href="https://iss.igorbedesqui.com/">
                iss.igorbedesqui.com
              </StyledLinkWithIcon>
            </p>
          </Band>
        </ProjectLayout>
      </ProjectContainer>
    </>
  );
}

import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";
import TransWithComps from "@/components/i18nStuff/TransWithComps";

import Seo from "@/components/Seo";
import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import HeroBand from "@/components/HeroBand";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import Band from "@/components/Band";
import StyledLinkWithIcon from "@/components/ui/StyledLink";
import { ProjectLayout } from "@/components/ProjectStuff/ProjectLayout";

import useMeta from "@/hooks/useMeta";

import Image from "next/image";
