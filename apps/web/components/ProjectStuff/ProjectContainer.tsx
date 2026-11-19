function ProjectContainer({
  children,
  backMessage,
  backAnchor = "/work",
  ...props
}: React.ComponentPropsWithRef<"div"> &
  Pick<ContainerProps, "mainProps" | "footer"> & {
    backMessage?: string;
    backAnchor?: string;
  }) {
  return (
    <Container
      backable
      backAnchor={backAnchor}
      backMessage={backMessage}
      {...props}
    >
      {children}
    </Container>
  );
}

export default ProjectContainer;

import Container, { type ContainerProps } from "@/components/Container";
