import { ContentList, contentListRow } from "@/components/ContentList";
import { cn } from "@/lib/styling";

export type ProjectLinkProps = Omit<
  React.ComponentPropsWithRef<typeof UnstyledLink>,
  "href"
> & {
  project: Meta;
  href?: string;
};

export function ProjectLink({
  project,
  href = `/work/${project.urlSlug}`,
  children,
  className,
  ...props
}: ProjectLinkProps) {
  return (
    <UnstyledLink
      className={cn(
        contentListRow,
        "py-8 hover:opacity-100! focus:opacity-100! md:py-6",
        className,
      )}
      href={href}
      {...props}
    >
      {children === undefined ? (
        <>
          <h3 className="text-xl font-semibold tracking-tighter">
            {project.name}
          </h3>
          <p>{project.description}</p>
        </>
      ) : (
        children
      )}
    </UnstyledLink>
  );
}

export type ProjectsProps = Omit<
  React.ComponentPropsWithRef<typeof ContentList>,
  "children"
> & {
  projectsMeta: readonly Meta[];
  renderProject?: (
    props: ProjectLinkProps & { href: string },
  ) => React.ReactNode;
};
function Projects({
  projectsMeta,
  renderProject,
  className,
  ...props
}: ProjectsProps) {
  return (
    <ContentList
      className={cn(
        "-mx-2 w-[calc(100%+1rem)] hover:[&>li>a]:opacity-40 focus-within:[&>li>a]:opacity-40 md:grid md:grid-cols-2 md:gap-x-6 [&>li:first-child>a]:pt-0 [&>li:last-child>a]:pb-0 md:[&>li:nth-child(2)>a]:pt-0 md:[&>li:nth-last-child(2):nth-child(odd)>a]:pb-0",
        className,
      )}
      {...props}
    >
      {projectsMeta.map((project) => (
        <li key={project.name}>
          {renderProject === undefined ? (
            <ProjectLink project={project} />
          ) : (
            renderProject({ project, href: `/work/${project.urlSlug}` })
          )}
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
  roles: readonly string[];
  type: string;
  tools: readonly string[];
  date: string;
  urlSlug: string;
  backMessage?: string;
  draft: boolean;
};
