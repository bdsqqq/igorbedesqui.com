export default function Projects() {
  const issMeta = useProjMeta("iss");
  const projectsMeta = [issMeta, issMeta, issMeta];

  return (
    <div className="flex flex-col items-center justify-start min-h-96 md:flex-row md:justify-between">
      <ul className="min-h-4 w-full grid grid-cols-1fr18rem gap-12">
        {projectsMeta.map((project, i) => {
          return (
            <li>
              <article>
                <h3 className="font-bold text-2xl">{project.name}</h3>

                <div className="font-light opacity-50 mb-4">
                  {project.roles[0]}
                </div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius
                  sapiente iusto iure vitae nesciunt magni.
                </p>

                <div className="flex justify-between">
                  <span> — </span>
                  <Link
                    href={`/p/${project.shortName.toLowerCase()}`}
                    passHref
                    key={`li-${i}`}
                  >
                    <motion.a
                      className=" cursor-pointer inline-block p-1 mr-2 md:mr-8 pb-0 select-none"
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
}

import Link from "next/link";
import { motion } from "framer-motion";

import useProjMeta from "../../hooks/useProjMeta";
