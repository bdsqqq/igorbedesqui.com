export default function Custom404() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <MainNav backable />

      <div
        id="skip"
        tabIndex={-1}
        className="flex items-center justify-center mt-60"
      >
        <h1 className="text-2xl pr-6 border-r border-igor-500">404</h1>
        <h2 className="pl-6">{t("common:404")}</h2>
      </div>
    </div>
  );
}

import useTranslation from "next-translate/useTranslation";

import MainNav from "../components/MainNav";
