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
          <div className="flex gap-8">
            <Button>hej do</Button>
            <button
              style={{ backgroundClip: "padding-box" }}
              className={cx(
                "rounded-sm select-none shadow-input shadow-gray-A5 border border-gray-A5 bg-gray-1 py-2 px-4 text-gray-11 hover:text-gray-12 transition-all hover:bg-gray-2 active:shadow-gray-A4 active:scale-95 origin-center duration-fast-02 ease-expressive-standard bg-gradient-to-t from-gray-1 to-gray-3 hover:from-gray-2 hover:to-gray-4 active:from-gray-1 active:to-gray-3  disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 disabled:text-gray-10 "
              )}
            >
              Meatballs
            </button>
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
