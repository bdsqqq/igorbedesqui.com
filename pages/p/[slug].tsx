import { useMDXComponent } from "next-contentlayer/hooks";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { allProjects } from ".contentlayer/data";
import type { Project } from ".contentlayer/types";
import type { GetStaticPathsContext, GetStaticPathsResult } from "next";

export async function getStaticPaths({
  locales,
}: GetStaticPathsContext): Promise<GetStaticPathsResult> {
  let paths: { params: { slug: string }; locale: string }[] = [];
  locales?.forEach((locale) => {
    // filter the pages that belong to each locale
    let localeProjects = allProjects.filter((p) => p.lang == locale);

    // add pages to paths only with its corresponding locale
    paths.push(
      ...localeProjects.map((p) => ({
        params: { slug: p.slug },
        locale: locale,
      }))
    );
  });

  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const project = allProjects.find((project) => project.slug === params.slug);

  return { props: { project } };
}

const Component = () => {
  return (
    <div style={{ background: "black", width: "200px", height: "200px" }} />
  );
};

const mdxComponents = {
  Component,
};

const ProjectLayout = ({ project }: { project: Project }) => {
  const MDXContent = useMDXComponent(project.body.code);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{project.title}</title>
      </Head>
      <article>
        <Link
          href={`${project?.alternate?.slug}`}
          locale={project?.alternate?.locale}
        >{`${project?.alternate?.slug}`}</Link>
        <button
          onClick={() => {
            console.log(router.locale);
          }}
        >
          Hej
        </button>
        <div>
          <h1>{project.title}</h1>
        </div>
        <MDXContent components={mdxComponents} />
      </article>
    </>
  );
};

export default ProjectLayout;
