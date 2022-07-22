type ProjectsProps = {
  projectsMeta: Meta[];
};
const Projects: React.FC<ProjectsProps> = ({ projectsMeta }) => {
  return (
    <ProjsList>
      {projectsMeta.map((project, i) => {
        return (
          <Link href={`/p/${project.urlSlug}`} key={project.name}>
            <li>
              <Box
                as="h3"
                css={{
                  fontSize: "$lg",
                  fontWeight: "600",
                  letterSpacing: "$tighter",
                }}
              >
                {project.name}
              </Box>
              <p>{project.description}</p>
            </li>
          </Link>
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
  alignItems: "start",
  justifyContent: "start",

  pointerEvents: "none",
  "&:hover": {
    color: "$mauve11",

    "& > a": {
      opacity: "0.4",
    },
  },

  "@md": {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    columnGap: "$spacing-06",
  },
});

const Link = styled(UnstyledLink, {
  width: "100%",
  py: "$spacing-07",

  // this pointer event will bubble up and activate the hover style of the parent
  pointerEvents: "auto",

  "&:first-child": {
    paddingTop: 0,
  },
  "&:last-child": {
    paddingBottom: 0,
  },

  "@md": {
    py: "$spacing-06",

    "&:nth-child(2)": {
      paddingTop: 0,
    },

    // remove padding bottom of second last child only if it is in the last line eg:
    /* 
      | 1 | 2 |
      | 3 |
      > 2 is the second last but it still keeps the padding bottom

      | 1 | 2 |
      | 3 | 4 |
      > 3 is the second last and in the last row so it loses it's padding bottom

      btw, this 2 is tied to the gridTemplateColumns repeat(2, 1fr) of the parent. If I change that, then I'll have to update this part but it definetely isn't worth abstracting it rn
    */
    "&:nth-last-child(2):nth-child(odd)": {
      paddingBottom: 0,
    },
  },

  "&:hover": {
    color: "$mauve12",
    opacity: "1 !important",
  },

  "@motionOk": {
    transitionProperty: "color opacity",
    transitionDuration: duration.moderate01,
    transitionTimingFunction: timingFunction.productive.standard,
  },
});

export default Projects;

import { styled } from "stitches.config";
import { Box, UnstyledLink } from "@/ui/primitives";
import { Meta } from "@/hooks/useMeta";
import { duration, timingFunction } from "@/animations";
