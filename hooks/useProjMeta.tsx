function useProjMeta(projName: string) {
  const { t } = useTranslation(`projs/meta`);
  return {
    name: t(`${projName}.name`),
    role: t(`${projName}.role`),
    type: t(`${projName}.type`),
    tools: t(`${projName}.tools`),
    date: t(`${projName}.date`),
  };
}

export default useProjMeta;

import useTranslation from "next-translate/useTranslation";
