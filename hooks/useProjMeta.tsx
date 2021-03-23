export type projMeta = {
  shortName: string;
  name: string;
  description: string;
  roles: string[];
  type: string;
  tools: string[];
  date: string;
};

function useProjMeta(projName: string) {
  const { t } = useTranslation(`projs/meta`);
  return {
    shortName: projName,
    name: t(`${projName}.name`),
    description: t(`${projName}.description`),
    roles: t(`${projName}.roles`).split(","),
    type: t(`${projName}.type`),
    tools: t(`${projName}.tools`).split(","),
    date: t(`${projName}.date`),
  };
}

export default useProjMeta;

import useTranslation from "next-translate/useTranslation";
