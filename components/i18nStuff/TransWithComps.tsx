type TransWithCompsProps = {
  i18nKey: string;
  extraComponents?: object;
};
const TransWithComps: React.FC<TransWithCompsProps> = ({
  i18nKey,
  extraComponents,
}) => {
  const baseComponents = {
    br: <br />,
    b: <strong className="font-bold" />,
  };

  return (
    <Trans
      i18nKey={i18nKey}
      components={
        extraComponents
          ? Object.assign(baseComponents, extraComponents)
          : baseComponents
      }
    />
  );
};

export default TransWithComps;

import Trans from "next-translate/Trans";
