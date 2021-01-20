interface ExternalLinkProps {
  href?: string;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({ href, children }) => (
  <a
    className="text-gray-500 hover:text-gray-600 transition"
    target="_blank"
    rel="noopener noreferrer"
    href={href}
  >
    {children}
  </a>
);

export default ExternalLink;
