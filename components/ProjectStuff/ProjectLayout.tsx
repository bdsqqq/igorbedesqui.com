export const ProjectLayout: React.FC<
  React.PropsWithChildren<{
    projMeta: Meta;
    nextProjMeta?: Meta;
  }>
> = ({ children, projMeta, nextProjMeta }) => {
  return (
    <div className="grid md:gap-5 md:[grid-template-columns:1fr_220px] lg:gap-20 lg:[grid-template-columns:1fr_330px] px-8 md:px-16">
      <div>{children}</div>

      <div>
        <div className="sticky top-[1.5rem] pt-8 px-8 md:pr-24 md:px-0 md:right-16 overflow-auto max-h-[calc(100vh_-_1.5rem)]">
          <div>
            <div className="mb-6">
              <p className="font-semibold">Type of work</p>
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

            <div className="mb-6">
              <p className="font-semibold">Tools</p>
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

            <div className="mb-8">
              <span className="font-semibold">Date</span>
              <p>{projMeta.date}</p>
            </div>

            <div className="mb-6">
              <span className="font-semibold">Project type</span>
              <p>{projMeta.type}</p>
            </div>

            {nextProjMeta && (
              <>
                <Separator className="w-11 my-12" />

                <div className="mb-6">
                  <span className="font-semibold">Next project</span>
                  <span className="flex gap-0.5 items-center text-mauve11">
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

import { Meta } from "@/hooks/useMeta";
import React from "react";
