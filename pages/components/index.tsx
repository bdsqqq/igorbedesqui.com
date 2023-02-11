import Band from "@/components/Band";
import Container from "@/components/Container";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/Button";
import PopOver from "@/components/ui/Popover";
import { cx } from "class-variance-authority";

export default function Writing() {
  return (
    <>
      <Seo title="Writing" description="" url="writing" ogText="*Writing*" />

      <Container backable key="index">
        <Band
          headline={{
            bold: "01",
            thin: "buttons",
          }}
        >
          <div className="flex flex-col gap-8">
            <div>
              <p>
                OLD<span className="text-gray-6">...?</span>
              </p>
              <div className="flex gap-8">
                <div className="bg-gray-0 p-4 h-fit rounded-sm">
                  <Button>Huh</Button>
                </div>
                <div className="bg-gray-1 p-4 h-fit rounded-sm">
                  <Button>Huh</Button>
                </div>
                <div className="bg-gray-2 p-4 h-fit rounded-sm">
                  <Button>Huh</Button>
                </div>
                {/* <div className="bg-gray-1 p-4 h-fit rounded-sm">
              <button
                style={{ backgroundClip: "padding-box" }}
                className={cx(
                  "rounded-sm select-none shadow-input shadow-gray-A5 border border-gray-A5 bg-gray-1 py-2 px-4 text-gray-11 hover:text-gray-12 transition-all hover:bg-gray-2 active:shadow-gray-A4 active:scale-95 origin-center duration-fast-02 ease-expressive-standard bg-gradient-to-t from-gray-1 to-gray-3 hover:from-gray-2 hover:to-gray-4 active:from-gray-1 active:to-gray-3  disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 disabled:text-gray-10 "
                )}
              >
                Real
              </button>
            </div> */}
              </div>
            </div>
            <div>
              <p>
                NEW<span className="text-gray-6">...?</span>
              </p>
              <div className="flex gap-8">
                <div className="flex gap-8 bg-gray-0 p-4 h-fit rounded-sm">
                  <button
                    className={cx(
                      "relative select-none rounded-sm px-2 py-1",
                      "transition-all duration-fast-02 ease-expressive-standard",
                      "border border-gray-A4",
                      "shadow-input shadow-gray-A3",
                      "bg-gradient-to-tr from-gray-A3 to-gray-A5",
                      "before:absolute before:inset-0 before:rounded before:shadow-lg before:shadow-gray-0/50 ",
                      "hover:border-gray-A8 focus-visible:border-gray-A8 before:transition-all before:duration-fast-02 before:ease-expressive-standard",
                      "active:scale-95"
                    )}
                  >
                    Huh
                  </button>
                  <div
                    className={cx(
                      "after:absolute after:inset-0 after:rounded after:shadow-lg after:shadow-gray-0/50 after:pointer-events-none",
                      "relative"
                    )}
                  >
                    <input
                      className={cx(
                        "relative select-none rounded-sm px-2 py-1",
                        "transition-all duration-fast-02 ease-expressive-standard",
                        "border border-gray-A4",
                        "shadow-input shadow-gray-A3",
                        "bg-gray-0 bg-gradient-to-t from-gray-A3 to-gray-A5",
                        "hover:border-gray-A8 focus-visible:border-gray-A8 before:transition-all before:duration-fast-02 before:ease-expressive-standard"
                      )}
                      type="text"
                    ></input>
                  </div>
                </div>
                <div className="bg-gray-1 p-4 h-fit rounded-sm">
                  <button
                    className={cx(
                      "relative select-none rounded-sm px-2 py-1",
                      "transition-all duration-fast-02 ease-expressive-standard",
                      "border border-gray-A5",
                      "shadow-input shadow-gray-A3",
                      "bg-gradient-to-tr from-gray-A2 to-gray-A4",
                      "before:absolute before:inset-0 before:rounded before:shadow-lg before:shadow-[hsl(0 0% 100% / 1)]",
                      "hover:border-gray-A7 focus-visible:border-gray-A7",
                      "active:scale-95"
                    )}
                  >
                    Huh
                  </button>
                </div>
                <div className="bg-gray-2 p-4 h-fit rounded-sm">
                  <button
                    className={cx(
                      "relative select-none rounded-sm px-2 py-1",
                      "transition-all duration-fast-02 ease-expressive-standard",
                      "border border-gray-A5",
                      "shadow-input shadow-gray-A3",
                      "bg-gradient-to-tr from-gray-A2 to-gray-A4",
                      "before:absolute before:inset-0 before:rounded before:shadow-lg before:shadow-[hsl(0 0% 100% / 1)]",
                      "hover:border-gray-A7 focus-visible:border-gray-A7",
                      "active:scale-95"
                    )}
                  >
                    Huh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Band>
        <Band
          headline={{
            bold: "02",
            thin: "popover",
          }}
        >
          <div className="flex gap-8 items-center">
            <PopOver content="Hej do">Hej</PopOver>
            <PopOver content="Hej do">Hej</PopOver>
          </div>
        </Band>
      </Container>
    </>
  );
}
