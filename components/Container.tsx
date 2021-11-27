type ContainerProps =
  | {
      backable?: boolean;
      backMessage?: never;
      backAnchor?: never;
    }
  | {
      backable: true;
      backMessage?: string;
      backAnchor?: string;
    };

const Container: React.FC<ContainerProps> = ({
  backable,
  backMessage,
  backAnchor,
  children,
}) => {
  const childrenArray: any[] = Children.toArray(children);
  let dark: boolean | undefined;
  if (childrenArray.length > 0) {
    dark = childrenArray[childrenArray.length - 1].props.dark;
  }

  return (
    <Box
      css={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "$mauve1",

        "@motion": {
          animation: `${fade}`,
          animationDuration: "550ms",
          animationTimingFunction: "cubic-bezier(0, 0, 0.3, 1)",
        },
      }}
    >
      {!backable ? (
        <MainNav />
      ) : (
        <MainNav
          backable={backable}
          backMessage={backMessage}
          backAnchor={backAnchor}
        />
      )}
      <Flex
        css={{
          position: "relative",

          marginTop: "-0.5rem",
          minHeight: "calc(100vh - 104px)",
          width: "100%",
          backgroundCOlor: "$mauve1",

          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Flex
          as="main"
          css={{
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {children}
        </Flex>
        <Footer dark={dark} />
      </Flex>
    </Box>
  );
};

export default Container;

import { Children } from "react";

import { Box, Flex } from "@/ui/primitives";
import { fade } from "@/animations";

import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
