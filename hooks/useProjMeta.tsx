function useProjMeta(projName: string) {
  const { t } = useTranslation(`projs/meta`);
  return {
    shortName: projName,
    name: t(`${projName}.name`),
    roles: t(`${projName}.roles`).split(","),
    type: t(`${projName}.type`),
    tools: t(`${projName}.tools`).split(","),
    date: t(`${projName}.date`),
    imgSrc: t(`${projName}.imgSrc`),
    imgWidth: t(`${projName}.imgWidth`),
    imgHeight: t(`${projName}.imgHeight`),
  };
}

export default useProjMeta;

import useTranslation from "next-translate/useTranslation";
