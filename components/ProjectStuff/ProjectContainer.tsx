function ProjectContainer({
  children,
  backMessage,
}: React.PropsWithChildren<{ backMessage?: string }>) {
  return (
    <Container backable backAnchor="/work" backMessage={backMessage}>
      {children}
    </Container>
  );
};

export default ProjectContainer;

import Container from "@/components/Container";
