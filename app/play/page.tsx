import Container from "@/components/Container";
import EmailLink from "@/components/ui/EmailLink";
import { grid, subGrid } from "@/components/ui/Grid";

import { bebopMeta, psykipMeta, ibmMeta } from "app/work/metas";
import { basicsMeta, onWritingMeta } from "app/writing/metas";

import { MDX } from "@/components/MDX";
import { Blur } from "@/components/ui/Blur";
import type { Metadata } from "next";
import StyledLink from "@/components/ui/StyledLink";
import { cn } from "@/lib/styling";
import { HTMLProps } from "react";

const makeSeo = ({
  title,
  description,
  slug,
  ogText,
}: {
  title: string;
  description: string;
  slug: string;
  ogText: string;
}): Metadata => {
  const ogImageUrl = new URL(
    `https://www.igorbedesqui.com/api/og?text=${ogText}`
  ).href;

  return {
    title,
    description,
    twitter: {
      site: "@bdsqqq",
      creator: "@bdsqqq",
      // @ts-ignore
      card: "summary_large_image",
      title: title,
      description: description,
      image: ogImageUrl,
      imageAlt: ogText.replace("*", ""),
    },
    openGraph: {
      title: title,
      description: description,
      url: `https://www.igorbedesqui.com${slug}`,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogText.replace("*", "").replace("/n", ""),
        },
      ],
    },
  };
};

export const metadata: Metadata = makeSeo({
  title: "Igor Bedesqui",
  description:
    "Crafting web experiences with care. Exploring design, UX, and interactivity.",
  slug: "/",
  ogText:
    "*Crafting web experiences*/n*with care*. *Exploring design*,/n*UX*, and *interactivity*.",
});

export default async function Home() {
  return (
    <Container key="index">
      <div className="flex flex-col gap-20">
        <div className="flex flex-row-reverse items-center justify-center border border-gray-A5 p-20">
          <ManualLanding className="-ml-16 hidden translate-y-4 rotate-6 transform" />
          <ManualChapterPage className="rotate-2 transform" />
          <ManualCompare className="-mr-16 hidden translate-y-4 -rotate-6 transform" />
        </div>
      </div>
    </Container>
  );
}

const ManualLanding = ({ className, ...rest }: HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "relative aspect-[3/4] w-52 overflow-hidden rounded border border-gray-A5 bg-gray-0",
        className
      )}
      {...rest}
    >
      <div className="absolute top-8 right-4 aspect-[3/4] w-2/6 bg-gray-A3" />
      <div className="absolute top-1/2 left-4 w-2/6 space-y-4">
        <div className="h-4 w-full rounded-lg bg-gray-A3" />
        <div className="space-y-1">
          <div className="h-2 w-full rounded-lg bg-gray-A3" />
          <div className="h-2 w-4/5 rounded-lg bg-gray-A3" />
        </div>
      </div>
      <div className="template-cols-3 absolute -bottom-1 left-4 right-4 grid grid-cols-3 gap-2">
        <div className="col-span-1 h-6 w-full rounded-lg bg-gray-A3" />
        <div className="col-span-2 space-y-1">
          <div className="h-2 w-full rounded-lg bg-gray-A3" />
          <div className="h-2 w-full rounded-lg bg-gray-A3" />
        </div>
      </div>
    </div>
  );
};

const ManualCompare = ({ className, ...rest }: HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "relative aspect-[3/4] w-52 overflow-hidden rounded border border-gray-A5 bg-gray-0",
        className
      )}
      {...rest}
    >
      <div className="absolute top-8 right-4 aspect-[3/4] w-2/6 bg-gray-A3" />
      <div className="absolute top-1/2 left-4 w-2/6 space-y-4">
        <div className="h-4 w-full rounded-lg bg-gray-A3" />
        <div className="space-y-1">
          <div className="h-2 w-full rounded-lg bg-gray-A3" />
          <div className="h-2 w-4/5 rounded-lg bg-gray-A3" />
        </div>
      </div>
      <div className="template-cols-3 absolute -bottom-1 left-4 right-4 grid grid-cols-3 gap-2">
        <div className="col-span-1 h-6 w-full rounded-lg bg-gray-A3" />
        <div className="col-span-2 space-y-1">
          <div className="h-2 w-full rounded-lg bg-gray-A3" />
          <div className="h-2 w-full rounded-lg bg-gray-A3" />
        </div>
      </div>
    </div>
  );
};

const ManualChapterPage = ({
  className,
  ...rest
}: HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "relative aspect-[3/4] w-52 overflow-hidden rounded border border-gray-A5 bg-gray-0",
        className
      )}
      {...rest}
    >
      <div className="absolute top-4 -bottom-4 left-4 right-4 flex flex-col gap-4">
        <Chapter lines={4} />
        <Chapter lines={8} />
        <Chapter lines={3} />
        <Chapter lines={2} />
        <Chapter lines={6} />
      </div>
    </div>
  );
};

const Chapter = ({ lines = 1 }: { lines?: number }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full items-end gap-0.5">
        <div className="h-4 w-2 rounded-lg bg-gray-A3" />
        <div className="h-2 w-full rounded-lg bg-gray-A3" />
      </div>

      {new Array(4).map(() => (
        <div key={""} className="h-2 w-full rounded-lg bg-gray-A3" />
      ))}
    </div>
  );
};
