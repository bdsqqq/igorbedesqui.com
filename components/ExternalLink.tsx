interface ExternalLinkProps {
  href?: string;
  aClassList?: string;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({
  href,
  children,
  aClassList,
}) => (
  <a
    className={aClassList}
    target="_blank"
    rel="noopener noreferrer"
    href={href}
  >
    {children}
  </a>
);

export default ExternalLink;
