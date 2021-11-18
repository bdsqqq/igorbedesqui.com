interface BandPropsBasic {
  dark?: boolean;
  padless?: boolean;
}

interface BandWithGrid extends BandPropsBasic {
  headline: {
    bold: string;
    thin: string;
  };
  gridless?: never;
  id?: never;
}

interface BandGridless extends BandPropsBasic {
  headline?: never;
  gridless: true;
  id: string;
}

type BandProps = BandWithGrid | BandGridless;

const Band: React.FC<BandProps> = ({
  dark,
  gridless,
  padless,
  id,
  headline,
  children,
}) => {
  let bandId: string = "";
  id && (bandId = id);
  headline && (bandId = headline.thin);

  return (
    <BandWrapper
      padless={padless}
      id={bandId.replace(/\s+/g, "-").toLowerCase()}
      className={dark ? darkTheme : ""}
    >
      <BandContent padless={padless} gridless={gridless}>
        {!gridless ? (
          <>
            <Title>
              <HeadlineBold>{headline?.bold}</HeadlineBold>
              <HeadlineThin>{headline?.thin}</HeadlineThin>
            </Title>

            <Box
              css={{
                "@md": {
                  gridColumn: "span 3 / span 3",
                },
              }}
            >
              {children}
            </Box>
          </>
        ) : (
          <>{children}</>
        )}
      </BandContent>
    </BandWrapper>
  );
};

const BandWrapper = styled("section", {
  width: "100%",
  background: "$mauve1",
  color: "$mauve12",

  py: "4rem",

  variants: {
    padless: {
      true: {
        padding: 0,
      },
    },
  },
});

const BandContent = styled("div", {
  maxWidth: "72rem",
  margin: "0 auto",
  px: "2rem",

  "@md": {
    px: "4rem",

    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  },

  variants: {
    padless: {
      true: {
        py: "0",
      },
    },
    gridless: {
      true: {
        display: "block",
      },
    },
  },
});

const Title = styled("h2", {
  marginBottom: "3rem",
  height: "max-content",

  "@md": {
    position: "sticky",
    top: "1rem",

    gridColumn: "span 1 / span 1",
    paddingRight: "1.5rem",
  },
});

const HeadlineBold = styled("span", {
  fontWeight: "bold",

  "@md": {
    fontSize: "4.5rem",
    lineHeight: "1",
    writingMode: "vertical-lr",
  },
});

const HeadlineThin = styled("div", {
  fontWeight: "light",
  color: "$mauve11",
  verticalAlign: "top",

  "@md": {
    display: "inline-block",
    width: "auto",

    fontSize: "1.125rem",
    lineHeight: "1.75rem",
    writingMode: "vertical-lr",
  },
});

export default Band;

import { styled, darkTheme } from "stitches.config";
import { Box } from "./ui/primitives";
