interface BandPropsBasic {
  dark?: boolean;
  padless?: boolean;
  smolPadding?: boolean;
  fullBleed?: boolean;
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

// TODO: update this typedef and component API. Instead of a mandatory gridless I could assume it by the absence of heading. Also, I can probably write a typedef that gives me nicer autocomplete .

const Band: React.FC<BandProps> = ({
  dark,
  gridless,
  padless,
  fullBleed,
  smolPadding,
  id,
  headline,
  children,
}) => {
  let bandId: string = "";
  id && (bandId = id);
  headline && (bandId = headline.thin);

  return (
    <section
      className={clsx(
        "w-full bg-mauve1 text-mauve12",
        smolPadding ? "py-8" : "p-8 md:p-16",
        padless && "p-0"
      )}
      id={bandId.replace(/\s+/g, "-").toLowerCase()}
    >
      <div
        className={clsx(
          !gridless && "md:grid md:grid-cols-4",
          !fullBleed && "md:max-w-7xl m-auto"
        )}
      >
        {!gridless ? (
          <>
            <h2 className="mb-12 h-max grid items-end md:items-start md:h-min md:sticky top-4 col-span-1 pr-16">
              <span className="font-bold text-mauve3 [grid-area:1/1/1/1] text-7xl leading-none md:[writing-mode:vertical-lr]">
                {headline?.bold}
              </span>
              <div className="font-bold text-mauve12 align-top [grid-area:1/1/1/1] pb-4 md:w-min md:pl-2 md:pb-2 text-lg md:[writing-mode:vertical-lr]">
                {headline?.thin}
              </div>
            </h2>

            <div className="md:[grid-column:span_3_/_span_3]">{children}</div>
          </>
        ) : (
          <>{children}</>
        )}
      </div>
    </section>
  );
};

export default Band;

import { clsx } from "clsx";
