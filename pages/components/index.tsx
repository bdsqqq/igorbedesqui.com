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
            <div
              className="h-fit border"
              style={{
                borderColor: "rgba(255, 0, 0, 0.2)",
              }}
            >
              <button
                style={{ backgroundClip: "padding-box" }}
                className={cx(
                  "rounded-sm select-none shadow-input shadow-gray-A4 border border-gray-A4 bg-gray-1 py-2 px-4 text-gray-11 hover:text-gray-12 transition-all hover:bg-gray-2 active:bg-gray-1 active:shadow-gray-A4"
                )}
              >
                Meatballs
              </button>
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
