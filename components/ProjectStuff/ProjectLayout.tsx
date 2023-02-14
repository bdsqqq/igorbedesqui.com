import Band, { BandProps } from "../Band";

export const ProjectLayout: React.FC<
  React.PropsWithChildren<{
    projMeta: Meta;
    nextProjMeta?: Meta;
  }>
> = ({ children, projMeta, nextProjMeta }) => {
  const [isFaded, setIsFaded] = React.useState(false);
  const asideRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!asideRef.current) return;
      const asidePxFromTopWhenSticky = 32;
      const asidePxFromTop = asideRef.current.getBoundingClientRect().top;

      // TODO: Should probably hook into useMeasure or something like that for now this is fine
      const bottomOfWindow =
        document.documentElement.scrollTop + window.innerHeight ===
        document.documentElement.offsetHeight;

      if (
        asidePxFromTop == asidePxFromTopWhenSticky &&
        bottomOfWindow === false
      ) {
        setIsFaded(true);
      } else {
        setIsFaded(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={cx("px-4 md:px-16", grid({ mode: "narrow" }))}>
      <div className="col-span-full md:col-end-7 lg:col-end-13 flex flex-col gap-16">
        {children}
      </div>

      <div className="col-span-full md:col-start-7 lg:col-start-13 sticky top-[1.5rem] overflow-auto max-h-[calc(100vh_-_4.5rem)] h-fit py-2 -my-2">
        <Separator className="md:hidden w-11 mb-12 mt-20" />

        {/* Mobile */}
        <div className={cx(subGrid()(), "gap-y-4 md:hidden")}>
          <SidebarContent projMeta={projMeta} />
          {nextProjMeta && (
            <>
              <div className="col-span-4">
                <Separator className="w-11 my-12" />

                <span className="font-bold text-gray-9">Next project</span>
                <span className="flex gap-0.5 items-center text-gray-11">
                  <StyledLink href={`/work/${nextProjMeta.urlSlug}`}>
                    {nextProjMeta.name}
                  </StyledLink>
                </span>
              </div>
            </>
          )}
        </div>

        {/* Desktop */}
        <div
          ref={asideRef}
          className={cx(subGrid()(), "hidden md:flex md:flex-col md:gap-6")}
        >
          <aside
            className={cx(
              "transition-opacity duration-fast-02 ease-expressive-standard hover:opacity-100 focus-within:opacity-100",
              isFaded ? "opacity-40" : "opacity-100"
            )}
          >
            <div tabIndex={0} className={"flex md:flex-col md:gap-6"}>
              <SidebarContent projMeta={projMeta} />
            </div>
          </aside>
          {nextProjMeta && (
            <>
              <div className="col-span-4">
                <Separator className="w-11 mb-12" />

                <span className="font-bold text-gray-9">Next project</span>
                <span className="flex gap-0.5 items-center text-gray-11">
                  <StyledLink href={`/work/${nextProjMeta.urlSlug}`}>
                    {nextProjMeta.name}
                  </StyledLink>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const SidebarContent = ({ projMeta }: { projMeta: Meta }) => {
  return (
    <>
      <div className="col-span-2">
        <p className="font-bold text-gray-9">Type of work</p>
        <ul>
          {projMeta.roles.map((role, i) => {
            return (
              <li key={`role-${i}`}>
                {role}
                {i < projMeta.roles.length - 1 && ","}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="col-span-2">
        <span className="font-bold text-gray-9">Project type</span>
        <p>{projMeta.type}</p>
      </div>

      <div className="col-span-2">
        <p className="font-bold text-gray-9">Tools</p>
        <ul>
          {projMeta.tools.map((tool, i) => {
            return (
              <li className="[display:inline_list-item]" key={i}>
                {tool}
                {i < projMeta.tools.length - 1 && ", "}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="col-span-2">
        <span className="font-bold text-gray-9">Date</span>
        <p>{projMeta.date}</p>
      </div>
    </>
  );
};

export const ProjectBand: FC<PropsWithChildren<BandProps>> = ({
  options,
  ...props
}) => {
  return (
    <Band
      options={{
        padding: "none",
        subGrid: {
          lg: 12,
          md: 6,
          sm: 4,
        },
      }}
      {...props}
    />
  );
};

import { Separator } from "@/ui/primitives/";
import StyledLink from "@/ui/StyledLink";

import { Meta } from "*.mdx";
import React, { FC, PropsWithChildren } from "react";
import { grid, subGrid } from "../ui/Grid";
import { cx } from "class-variance-authority";
