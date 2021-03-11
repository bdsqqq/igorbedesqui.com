interface DetailsBandProps {
  projName: string;
}

const DetailsBand: React.FC<DetailsBandProps> = ({ projName, children }) => {
  return (
    <Band headline={{ bold: "-", thin: projName }}>
      <div className="grid grid-cols-1fr12rem gap-4 pb-8">{children}</div>
    </Band>
  );
};

export default DetailsBand;

import Band from "../Band";
