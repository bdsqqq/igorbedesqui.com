const ProjectContainer: React.FC<
  React.PropsWithChildren<{ backMessage?: string }>
> = ({ children, backMessage }) => {
  return (
    <Container backable backAnchor="/p" backMessage={backMessage}>
      {children}
    </Container>
  );
};

export default ProjectContainer;

import Container from "@/components/Container";
