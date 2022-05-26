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
    <a
      className={aClassList}
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      {children}
      <span className="sr-only">{t("newTab")}</span>
    </a>
  );
};

export default ExternalLink;

import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";
