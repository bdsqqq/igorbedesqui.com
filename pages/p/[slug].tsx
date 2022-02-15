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

const Page = ({ project }: { project: Project }) => {
  const MDXContent = useMDXComponent(project.body.code);
  const HeroMdx = useMDXComponent(project.hej?.code);
  const issMeta = useMeta("iss", "projs");

  return (
    <>
      <HeroBand heroImg={project.heroImg} heroVideo={project.heroVideo}>
        <HeroMdx />
        <button
          onClick={() => {
            console.log(project);
          }}
        >
          Hej
        </button>
      </HeroBand>
      <Head>
        <title>{project.title}</title>
      </Head>
      <ProjectLayout projMeta={issMeta}>
        <MDXContent components={MDXComponents} />
      </ProjectLayout>
    </>
  );
};

export default Page;

import { useMDXComponent } from "next-contentlayer/hooks";
import Head from "next/head";
import { allProjects } from ".contentlayer/data";
import type { Project } from ".contentlayer/types";
import type { GetStaticPathsContext, GetStaticPathsResult } from "next";

import MDXComponents from "@/components/MDXcomponents";
import HeroBand from "@/components/HeroBand";
import { ProjectLayout } from "@/components/ProjectStuff/ProjectLayout";
import useMeta from "@/hooks/useMeta";
import Seo from "@/components/Seo";
