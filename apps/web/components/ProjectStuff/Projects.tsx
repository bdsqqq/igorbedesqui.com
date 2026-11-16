import { ContentList, contentListRow } from "@/components/ContentList";
import { cn } from "@/lib/styling";

type ProjectsProps = {
  projectsMeta: Meta[];
};
function Projects({ projectsMeta }: ProjectsProps) {
  return (
    <ContentList className="-mx-2 w-[calc(100%+1rem)] hover:[&>li>a]:opacity-40 focus-within:[&>li>a]:opacity-40 md:grid md:grid-cols-2 md:gap-x-6 [&>li:first-child>a]:pt-0 [&>li:last-child>a]:pb-0 md:[&>li:nth-child(2)>a]:pt-0 md:[&>li:nth-last-child(2):nth-child(odd)>a]:pb-0">
      {projectsMeta.map((project) => (
        <li key={project.name}>
          <UnstyledLink
            className={cn(
              contentListRow,
              "py-8 hover:opacity-100! focus:opacity-100! md:py-6",
            )}
            href={`/work/${project.urlSlug}`}
          >
            <h3 className="text-xl font-semibold tracking-tighter">
              {project.name}
            </h3>
            <p>{project.description}</p>
          </UnstyledLink>
        </li>
      ))}
    </ContentList>
  );
}

export default Projects;

import { UnstyledLink } from "@/ui/primitives";

export type Meta = {
  shortName: string;
  name: string;
  description: string;
  roles: string[];
  type: string;
  tools: string[];
  date: string;
  urlSlug: string;
  backMessage?: string;
  draft: boolean;
};
