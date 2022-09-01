interface ExternalLinkProps {
  href?: string;
  aClassList?: string;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({
  href,
  children,
  aClassList,
}) => {
  const { t } = useTypeSafeTranslation("common");
  return (
    // eslint-disable-next-line react/jsx-no-target-blank
    <a className={aClassList} target="_blank" href={href}>
      {children}
      <span className="sr-only">{t("newTab")}</span>
    </a>
  );
};

export default ExternalLink;

import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";
