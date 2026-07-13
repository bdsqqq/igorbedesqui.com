import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import Band from "@/components/Band";
import Container from "@/components/Container";
import { grid } from "@/components/ui/Grid";

export const Route = createFileRoute("/writing")({
  component: WritingLayout,
});

function WritingLayout() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const isWidePage = pathname === "/writing/scales";

  return (
    <Container backable backAnchor="/writing">
      {isWidePage ? (
        <Outlet />
      ) : (
        <Band id="" gridless>
          <div className={grid()}>
            <div className="prose col-start-1 col-end-5 space-y-4 md:col-start-2 md:col-end-8 lg:col-start-3 lg:col-end-15">
              <Outlet />
            </div>
          </div>
        </Band>
      )}
    </Container>
  );
}
