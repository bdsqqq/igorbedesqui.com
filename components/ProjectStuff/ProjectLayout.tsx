"use client";

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
    <div className={cn("px-4 md:px-16", grid({ mode: "narrow" }))}>
      <div className="col-span-full flex flex-col gap-16 md:col-end-7 lg:col-end-13">
        {children}
      </div>

      <div className="sticky top-[1.5rem] z-aboveVignette col-span-full -my-2 h-fit max-h-[calc(100vh_-_4.5rem)] overflow-auto py-2 md:col-start-7 lg:col-start-13">
        {/* Mobile */}
        <div className={cn(subGrid()(), "mt-20 gap-y-4 md:hidden")}>
          <SidebarContent projMeta={projMeta} />
          {nextProjMeta && (
            <>
              <div className="col-span-4 mt-12">
                <span className="text-gray-09 font-bold">Next project</span>
                <span className="flex items-center gap-0.5 text-gray-11">
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
          className={cn(subGrid()(), "hidden md:flex md:flex-col md:gap-6")}
        >
          <aside
            className={cn(
              "transition-opacity duration-fast-02 ease-expressive-standard focus-within:opacity-100 hover:opacity-100",
              isFaded ? "opacity-40" : "opacity-100",
            )}
          >
            <div tabIndex={0} className={"flex md:flex-col md:gap-6"}>
              <SidebarContent projMeta={projMeta} />
            </div>
          </aside>
          {nextProjMeta && (
            <>
              <div className="col-span-4">
                <Separator className="mb-12 w-11" />

                <span className="text-gray-09 font-bold">Next project</span>
                <span className="flex items-center gap-0.5 text-gray-11">
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

export const SidebarContent = ({ projMeta }: { projMeta: Meta }) => {
  return (
    <>
      <div className="col-span-2">
        <p className="text-gray-09 font-bold">Type of work</p>
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
        <span className="text-gray-09 font-bold">Project type</span>
        <p>{projMeta.type}</p>
      </div>

      <div className="col-span-2">
        <p className="text-gray-09 font-bold">Tools</p>
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
        <span className="text-gray-09 font-bold">Date</span>
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

import { Separator } from "@/ui/Separator";
import StyledLink from "@/ui/StyledLink";

import { Meta } from "@/components/ProjectStuff/Projects";
import React, { FC, PropsWithChildren } from "react";
import { grid, subGrid } from "../ui/Grid";
import { cn } from "@/lib/styling";
