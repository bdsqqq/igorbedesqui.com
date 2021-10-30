export default function Custom404() {
  const { t } = useTranslation();

  return (
    <Container backable>
      <div
        id="skip"
        tabIndex={-1}
        className="flex items-center justify-center"
        style={{ minHeight: "77vh" }}
      >
        <h1 className="text-2xl pr-6 border-r border-mauveDark-mauve6">404</h1>
        <h2 className="pl-6">{t("common:404")}</h2>
      </div>
    </Container>
  );
}

import useTranslation from "next-translate/useTranslation";
import Container from "@/components/Container";
