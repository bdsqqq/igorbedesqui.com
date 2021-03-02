export default function Iss() {
  return (
    <>
      <Container
        heading={
          <Trans
            i18nKey="projs/iss:something"
            components={[
              <span className="font-light text-sm sm:text-lg md:text-2xl" />,
              <br />,
              <span className="font-bold" />,
            ]}
          />
        }
        heroImg={{ src: "/images/background.jpg", alt: "" }}
      ></Container>
    </>
  );
}

export const issMeta = {};

import Container from "../../components/Container";
import Trans from "next-translate/Trans";
