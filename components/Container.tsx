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
    <div className="bg-mauve1">
      <div className="relative min-h-screen bg-mauve1 motion-safe:animate-fade">
        {!backable ? (
          <MainNav />
        ) : (
          <MainNav
            backable={backable}
            backMessage={backMessage}
            backAnchor={backAnchor}
          />
        )}
        <div className="relative flex flex-col justify-between -mr-2 min-h-[calc(100_-_104px)] w-full bg-mauve1">
          <main className="flex flex-col justify-center">{children}</main>
          <Footer dark={dark} />
        </div>
      </div>
    </div>
  );
};

export default Container;

import { Children } from "react";

import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
