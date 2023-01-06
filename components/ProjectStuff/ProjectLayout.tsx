import Band, { BandProps } from "../Band";

export const ProjectLayout: React.FC<
  React.PropsWithChildren<{
    projMeta: Meta;
    nextProjMeta?: Meta;
  }>
> = ({ children, projMeta, nextProjMeta }) => {
  return (
    <div className={cx("px-4 md:px-16", grid({ mode: "narrow" }))}>
      <div className="col-span-full md:col-end-7 lg:col-end-13 flex flex-col gap-16">
        {children}
      </div>

      <div className="col-span-full md:col-start-7 lg:col-start-13 sticky top-[1.5rem] overflow-auto max-h-[calc(100vh_-_4.5rem)]">
        <Separator className="md:hidden w-11 mb-12 mt-20" />

        <div className="grid grid-cols-2 gap-4 md:flex md:flex-col md:gap-6">
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

          <div>
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

          <div className="flex flex-col gap-4 md:gap-6">
            <div>
              <span className="font-bold text-gray-9">Project type</span>
              <p>{projMeta.type}</p>
            </div>

            <div>
              <span className="font-bold text-gray-9">Date</span>
              <p>{projMeta.date}</p>
            </div>
          </div>

          {nextProjMeta && (
            <>
              <Separator className="max-sm:hidden w-11 my-12" />

              <div className="col-span-2">
                <span className="font-bold text-gray-9">Next project</span>
                <span className="flex gap-0.5 items-center text-gray-11">
                  <StyledLink href={`/p/${nextProjMeta.urlSlug}`}>
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
import { grid } from "../ui/Grid";
import { cx } from "class-variance-authority";
