export const ProjectLayout: React.FC<
  React.PropsWithChildren<{
    projMeta: Meta;
    nextProjMeta?: Meta;
  }>
> = ({ children, projMeta, nextProjMeta }) => {
  return (
    <div className="grid md:gap-5 md:[grid-template-columns:1fr_220px] lg:gap-20 lg:[grid-template-columns:1fr_330px]">
      <div>{children}</div>

      <div>
        <div className="sticky top-[1.5rem] pt-8 px-8 md:pr-24 md:px-0 md:right-16 overflow-auto max-h-[calc(100vh_-_1.5rem)]">
          <div className="grid grid-cols-2 gap-4 md:flex md:flex-col md:gap-6">
            <div className="col-span-2">
              <p className="font-bold text-gray-10">Type of work</p>
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
              <p className="font-bold text-gray-10">Tools</p>
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
                <span className="font-bold text-gray-10">Project type</span>
                <p>{projMeta.type}</p>
              </div>

              <div>
                <span className="font-bold text-gray-10">Date</span>
                <p>{projMeta.date}</p>
              </div>
            </div>

            {nextProjMeta && (
              <>
                <Separator className="max-sm:hidden w-11 my-12" />

                <div className="col-span-2">
                  <span className="font-bold text-gray-10">Next project</span>
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
    </div>
  );
};

import { Separator } from "@/ui/primitives/";
import StyledLink from "@/ui/StyledLink";

import { Meta } from "*.mdx";
import React from "react";
