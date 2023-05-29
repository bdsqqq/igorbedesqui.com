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
  // const childrenArray: any[] = Children.toArray(children);
  // let dark: boolean | undefined;
  // if (childrenArray.length > 0) {
  //   dark = childrenArray[childrenArray.length - 1].props.dark;
  // }

  return (
    <div className="">
      <div className="relative min-h-screen">
        <div className=" pointer-events-none absolute z-30 h-full w-full bg-gray-0 opacity-0 motion-safe:animate-fadeOut" />
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
        <div className="relative -mr-2 flex min-h-[calc(100_-_104px)] w-full flex-col justify-between">
          <main className="flex flex-col justify-center">{children}</main>
          {/* <Footer /> */}
          <div className="mt-32" />
        </div>
      </div>
    </div>
  );
};

export default Container;

import React, { Children } from "react";

import { Overlay as GridOverlay } from "@/components/ui/Grid/Overlay";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
