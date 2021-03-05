interface DetailsBandProps {
  projName: string;
}

const DetailsBand: React.FC<DetailsBandProps> = ({ projName, children }) => {
  const { t } = useTranslation();

  return (
    <Band headline={{ bold: projName, thin: t("projs/detail:details") }}>
      <div className="grid grid-cols-1fr12rem gap-4 pb-8">{children}</div>
    </Band>
  );
};

export default DetailsBand;

import useTranslation from "next-translate/useTranslation";

import Band from "../Band";
