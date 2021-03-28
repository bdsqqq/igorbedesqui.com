interface DetailsBandProps {
  projName: string;
}

const DetailsBand: React.FC<DetailsBandProps> = ({ projName, children }) => {
  return (
    <Band gridless id={projName}>
      <div className="grid grid-cols-1fr12rem gap-8 pb-8 md:pl-4 text-xl">
        {children}
      </div>
    </Band>
  );
};

export default DetailsBand;

import Band from "../Band";
