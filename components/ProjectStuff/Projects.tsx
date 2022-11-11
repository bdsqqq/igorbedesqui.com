type ProjectsProps = {
  projectsMeta: Meta[];
};
const Projects: React.FC<ProjectsProps> = ({ projectsMeta }) => {
  return (
    <ul className="flex flex-wrap flex-col items-start justify-start w-full pointer-events-none md:grid md:grid-cols-2 md:gap-x-6 hover:text-mauve10 [&_>_a]:hover:opacity-40">
      {projectsMeta.map((project, i) => {
        return (
          <UnstyledLink
            className="w-full py-8 pointer-events-auto first:pt-0 last:pb-0 md:py-6 md:[&:nth-child(2)]:pt-0 md:[&:nth-last-child(2)_:nth-child(odd)]:pb-0 hover:!text-mauve12 hover:!opacity-100 motion-safe:transition-all duration-moderate-01 ease-productive-standard"
            href={`/p/${project.urlSlug}`}
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
import { Meta } from "*.mdx";
