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

const Container: React.FC<React.PropsWithChildren<ContainerProps>> = ({
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
    <div className="">
      <div className="relative min-h-screen motion-safe:animate-fade">
        {!backable ? (
          <MainNav />
        ) : (
          <MainNav
            backable={backable}
            backMessage={backMessage}
            backAnchor={backAnchor}
          />
        )}
        <GridOverlay />
        <div className="relative flex flex-col justify-between -mr-2 min-h-[calc(100_-_104px)] w-full">
          <main className="flex flex-col justify-center">{children}</main>
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
};

export default Container;

import React, { Children } from "react";

import { Overlay as GridOverlay } from "@/ui/Grid";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
