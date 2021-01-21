import ExternalLink from "./ExternalLink";
import NextLink from "next/link";

interface BandPropsBasic {
  dark?: boolean;
  cta?:
    | {
        external?: boolean;
        target: string;
        text: string;
        child?: never;
      }
    | {
        external?: boolean;
        target: string;
        child: React.ReactNode;
        text?: never;
      };
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
  id,
  headline,
  cta,
  children,
}) => {
  let bandId: string = "";
  id && (bandId = id);
  headline && (bandId = headline.thin);

  cta && (cta.target = cta.target.replace(/\s+/g, "-").toLowerCase());

  return (
    <>
      <section
        id={bandId.replace(/\s+/g, "-").toLowerCase()}
        className={`w-full py-16
        ${
          dark
            ? "bg-oliver-500 text-oliver-light"
            : "bg-oliver-light text-oliver-500"
        }`}
      >
        <div
          className={`max-w-6xl mx-auto px-8 md:px-16 
            ${!gridless && "md:grid grid-cols-4"}
        `}
        >
          {!gridless ? (
            <>
              <div className="col-span-1">
                <span className="font-bold">{headline?.bold}</span>
                <br />
                <span className="font-extralight">{headline?.thin}</span>
                <br />
                <br />
                <span className="hidden md:inline">//</span>
              </div>
              <div className="col-span-3">{children}</div>
            </>
          ) : (
            <>{children}</>
          )}
        </div>
        {cta && (
          <div className="flex justify-end w-full text-sm md:text-lg text-right mt-6 pr-8 md:pr-16 text-gray-500 hover:text-gray-600 transition">
            {cta.external ? (
              <ExternalLink href={cta.target}>
                {cta.text ? "— " + cta.text : cta.child}
              </ExternalLink>
            ) : (
              <NextLink href={cta.target}>
                {cta.text ? "— " + cta.text : cta.child}
              </NextLink>
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default Band;
