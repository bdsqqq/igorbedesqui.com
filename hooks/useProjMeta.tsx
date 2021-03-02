function useProjMeta(projName: string) {
  const { t } = useTranslation(`projs/meta`);
  return {
    name: t(`${projName}.name`),
    roles: t(`${projName}.roles`).split(","),
    type: t(`${projName}.type`),
    tools: t(`${projName}.tools`).split(","),
    date: t(`${projName}.date`),
  };
}

export default useProjMeta;

import useTranslation from "next-translate/useTranslation";
