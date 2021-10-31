type ProjectsProps = {
  projectsMeta: Meta[];
};
const Projects: React.FC<ProjectsProps> = ({ projectsMeta }) => {
  const { t } = useTranslation("common");

  return (
    <ProjsList className="min-h-4 w-full flex flex-wrap">
      {projectsMeta.map((project, i) => {
        return (
          <ProjLi key={`p-${i}`}>
            <Proj>
              <Box>
                <Title>{project.name}</Title>

                <SubTitle>{project.roles[0]}</SubTitle>
                <p>{project.description}</p>
              </Box>

              <Box css={{ display: "flex", justifyContent: "space-between" }}>
                <Span css={{ userSelect: "none" }}> — </Span>
                <AnimatedLink
                  href={`/p/${project.shortName.toLowerCase()}`}
                  key={`li-${i}`}
                >
                  {project.readMore ? project.readMore : t("readMore")} ⟶
                </AnimatedLink>
              </Box>
            </Proj>
          </ProjLi>
        );
      })}
    </ProjsList>
  );
};

const ProjsList = styled("ul", {
  width: "100%",

  display: "flex",
  flexWrap: "wrap",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "start",
  gap: "2rem",

  "@md": {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "4rem",
  },
});

const ProjLi = styled("li", {
  width: "100%",
  height: "100%",
});

const Proj = styled("article", {
  width: "100%",
  height: "100%",

  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

const Title = styled("h3", {
  fontWeight: "bold",
  fontSize: "1.5rem",
  lineHeight: "2rem",
});

const SubTitle = styled("div", {
  fontWeight: "300",
  color: "$mauve11",
  marginBottom: "1rem",
});

const AnimatedLink = styled(UnstyledLink, {
  cursor: "pointer",
  userSelect: "none",

  display: "inline-block",
  padding: "0.25rem",
  paddingBottom: "0",
  marginRight: "0.5rem",

  color: "$mauve11",

  transform: "translate(0)",
  transitionDuration: "150ms",
  transitionTimingFunction: "cubic-bezier(0.4, 0.14, 0.3, 1)",

  "&:hover, &:focus-within": {
    color: "$mauve12",
    transform: "translate(1rem)",
  },
});

export default Projects;

import { styled } from "stitches.config";
import { Box, Span, UnstyledLink } from "@/ui/primitives";
import { Meta } from "@/hooks/useMeta";
import useTranslation from "next-translate/useTranslation";
