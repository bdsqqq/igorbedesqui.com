type TransWithCompsProps = {
  text: string;
  extraComponents?: object;
};
const TransWithComps: React.FC<TransWithCompsProps> = ({
  text,
  extraComponents,
}) => {
  const baseComponents = {
    br: <br />,
    b: <strong className="font-bold" />,
  };

  return (
    <TransText
      text={text}
      components={
        extraComponents
          ? Object.assign(baseComponents, extraComponents)
          : baseComponents
      }
    />
  );
};

export default TransWithComps;

import TransText from "next-translate/TransText";
