interface DetailsBandProps {
  projName: string;
}

const DetailsBand: React.FC<DetailsBandProps> = ({ projName }) => {
  const { t } = useTranslation();

  return (
    <Band headline={{ bold: projName, thin: t("projs/detail:details") }}>
      <div className="grid grid-cols-1fr12rem gap-4 pb-8">{Children}</div>
    </Band>
  );
};

export default DetailsBand;

import useTranslation from "next-translate/useTranslation";
import { Children } from "react";

import Band from "../Band";
