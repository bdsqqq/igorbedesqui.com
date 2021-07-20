type DetailsBandProps = {
  id: string;
  projMeta: useMetaReturn;
  t: Translate;
};

const DetailsBand: React.FC<DetailsBandProps> = ({ id, projMeta, t }) => {
  return (
    <Band gridless id={id}>
      <div className="grid grid-cols-1fr12rem gap-8 pb-8 md:pl-4 text-xl">
        <div className="leading-loose mb-6">
          <h3 className="font-bold text-3xl">{t("detail:role")}</h3>
          <ul>
            {projMeta.roles.map((role, i) => {
              return (
                <li key={i}>
                  {role}
                  {i < projMeta.roles.length - 1 && ","}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="leading-loose mb-6">
          <h3 className="font-bold text-3xl">{t("detail:date")}</h3>
          <p>{projMeta.date}</p>
          <h3 className="font-bold text-3xl">{t("detail:type")}</h3>
          <p>{projMeta.type}</p>
        </div>

        <div className="leading-loose mb-6">
          <h3 className="font-bold text-3xl">{t("detail:tools")}</h3>
          <ul>
            {projMeta.tools.map((tool, i) => {
              return (
                <li key={i}>
                  {tool}
                  {i < projMeta.tools.length - 1 && ","}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Band>
  );
};

export default DetailsBand;

import type { Translate } from "next-translate";
import Band from "@/components/Band";
import type { useMetaReturn } from "@/hooks/useMeta";
