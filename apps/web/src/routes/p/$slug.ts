import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/p/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ href: `/work/${params.slug}`, statusCode: 301 });
  },
});
