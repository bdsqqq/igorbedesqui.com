type ProjectsProps = {
  projectsMeta: projMeta[];
};
const Projects: React.FC<ProjectsProps> = ({ projectsMeta }) => {
  return (
    <div className="flex flex-col items-center justify-start min-h-96 md:flex-row md:justify-between">
      <ul className="min-h-4 w-full flex flex-wrap">
        {projectsMeta.map((project, i) => {
          return (
            <li
              className={`md:max-w-1/2 ${
                (i + 1) % 2 == 0 ? "md:pl-4" : "md:pr-4"
              }`}
              key={`p-${i}`}
            >
              <article>
                <h3 className="font-bold text-2xl">{project.name}</h3>

                <div className="font-light opacity-50 mb-4">
                  {project.roles[0]}
                </div>
                <p>{project.description}</p>

                <div className="flex justify-between">
                  <span> — </span>
                  <Link
                    href={`/p/${project.shortName.toLowerCase()}`}
                    passHref
                    key={`li-${i}`}
                  >
                    <motion.a
                      className=" cursor-pointer inline-block p-1 mr-2 pb-0 select-none"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 0.6, x: 0 }}
                      whileHover={{ opacity: 1, x: 10 }}
                      whileFocus={{ opacity: 1, x: 10 }}
                    >
                      leia mais ⟶
                    </motion.a>
                  </Link>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Projects;

import Link from "next/link";
import { motion } from "framer-motion";

import { projMeta } from "../../hooks/useProjMeta";
