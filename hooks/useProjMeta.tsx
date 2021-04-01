export type projMeta = {
  shortName: string;
  name: string;
  description: string;
  roles: string[];
  type: string;
  tools: string[];
  date: string;
  readMore?: string;
};

type projMetaT = {
  name: string;
  description: string;
  roles: string;
  type: string;
  tools: string;
  date: string;
  readMore?: string;
};

function useProjMeta(projName: string) {
  const { t } = useTranslation(`projs/meta`);
  const {
    name,
    description,
    roles,
    type,
    tools,
    date,
    readMore,
  }: projMetaT = t(projName, null, { returnObjects: true });
  return {
    shortName: projName,
    name: name,
    description: description,
    roles: roles.split(","),
    type: type,
    tools: tools.split(","),
    date: date,
    readMore: readMore,
  };
}

export default useProjMeta;

import useTranslation from "next-translate/useTranslation";
