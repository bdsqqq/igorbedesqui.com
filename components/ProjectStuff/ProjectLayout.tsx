import Band, { BandProps } from "../Band";

export const ProjectLayout: React.FC<
  React.PropsWithChildren<{
    projMeta: Meta;
    nextProjMeta?: Meta;
  }>
> = ({ children, projMeta, nextProjMeta }) => {
  // reduce opacity after user scrolls
  const [isFaded, setIsFaded] = React.useState(false);
  React.useEffect(() => {
    const handleScroll = () => {
      // Should probably hook into useMeasure or something like that for now this is fine
      const bottomOfWindow =
        document.documentElement.scrollTop + window.innerHeight ===
        document.documentElement.offsetHeight;

      console.log(bottomOfWindow);
      if (window.scrollY > 400 && bottomOfWindow === false) {
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

      <div className="col-span-full md:col-start-7 lg:col-start-13 sticky top-[1.5rem] overflow-auto max-h-[calc(100vh_-_4.5rem)] h-fit">
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
        <div className={cx(subGrid()(), "hidden md:flex md:flex-col md:gap-6")}>
          <aside
            className={cx(
              "transition-opacity duration-fast-02 ease-expressive-standard hover:opacity-100 focus-within:opacity-100",
              isFaded ? "opacity-40" : "opacity-100"
            )}
          >
            <Accordion title="Details">
              <div className={"flex md:flex-col md:gap-6"}>
                <SidebarContent projMeta={projMeta} />
              </div>
            </Accordion>
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

const Accordion = ({ children, title }: { children: any; title: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-4">
      <button
        className="select-none flex items-center justify-between gap-2 text-gray-9"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="font-bold">{title}</span>
        <span
          className={cx(
            " transform transition-transform duration-fast-02 ease-productive-standard",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        >
          <ChevronDownIcon />
        </span>
      </button>
      <div
        className="grid overflow-hidden transition-all duration-moderate-02 ease-expressive-standard"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
        }}
      >
        <div
          aria-hidden={!isOpen}
          className={cx(
            "min-h-0 transition-all duration-moderate-02 ease-expressive-standard",
            isOpen ? "visible opacity-100" : "invisible opacity-0"
          )}
        >
          {children}
        </div>
      </div>
    </div>
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
import { ChevronDownIcon } from "@radix-ui/react-icons";
