export type Meta = {
  shortName: string;
  name: string;
  description: string;
  roles: string[];
  type: string;
  tools: string[];
  date: string;
  readMore?: string;
};

type MetaT = {
  name: string;
  description: string;
  roles: string;
  type: string;
  tools: string;
  date: string;
  readMore?: string;
};

export type useMetaReturn = {
  shortName: string;
  name: string;
  description: string;
  roles: string[];
  type: string;
  tools: string[];
  date: string;
  readMore: string | undefined;
};

function useMeta(metaName: string, namespace: string): useMetaReturn {
  const { t } = useTranslation(`${namespace}/meta`);
  const { name, description, roles, type, tools, date, readMore }: MetaT = t(
    metaName,
    null,
    { returnObjects: true }
  );
  return {
    shortName: metaName,
    name: name,
    description: description,
    roles: roles.split(","),
    type: type,
    tools: tools.split(","),
    date: date,
    readMore: readMore,
  };
}

export default useMeta;

import useTranslation from "next-translate/useTranslation";
