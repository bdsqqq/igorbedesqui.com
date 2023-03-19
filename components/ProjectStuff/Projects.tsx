type ProjectsProps = {
  projectsMeta: Meta[];
};
const Projects: React.FC<ProjectsProps> = ({ projectsMeta }) => {
  return (
    <ul className="pointer-events-none flex w-full flex-col flex-wrap items-start justify-start hover:text-gray-10 md:grid md:grid-cols-2 md:gap-x-6 [&_>_a]:hover:opacity-40">
      {projectsMeta.map((project, i) => {
        return (
          <UnstyledLink
            className="pointer-events-auto w-full py-8 duration-moderate-01 ease-productive-standard first:pt-0 last:pb-0 hover:!text-gray-12 hover:!opacity-100 motion-safe:transition-all md:py-6 md:[&:nth-child(2)]:pt-0 md:[&:nth-last-child(2)_:nth-child(odd)]:pb-0"
            href={`/work/${project.urlSlug}`}
            key={project.name}
          >
            <li>
              <h3 className="text-xl font-semibold tracking-tighter">
                {project.name}
              </h3>
              <p>{project.description}</p>
            </li>
          </UnstyledLink>
        );
      })}
    </ul>
  );
};

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
