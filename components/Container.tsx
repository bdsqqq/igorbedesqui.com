type ContainerProps =
  | {
      backable?: boolean;
      backMessage?: never;
      backTarget?: never;
    }
  | {
      backable: true;
      backMessage?: string;
      backTarget?: string;
    };

const Container: React.FC<ContainerProps> = ({
  backable,
  backMessage,
  backTarget,
  children,
}) => {
  const childrenArray: any = Children.toArray(children);
  const dark: boolean | undefined =
    childrenArray[childrenArray.length - 1].props.dark;

  return (
    <div className="relative min-h-screen bg-igor-light">
      {!backable ? (
        <MainNav />
      ) : (
        <MainNav
          backable={backable}
          backMessage={backMessage}
          backTarget={backTarget}
        />
      )}
      <div className="relative -mt-2 bg-igor-light min-h-30vh rounded-tl-2xl w-full">
        <main className="flex flex-col justify-center">{children}</main>
        <Footer dark={dark} />
      </div>
    </div>
  );
};

export default Container;

import { Children } from "react";

import MainNav from "./MainNav";
import Footer from "./Footer";
