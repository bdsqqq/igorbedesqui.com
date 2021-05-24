interface DetailsBandProps {
  id: string;
}

const DetailsBand: React.FC<DetailsBandProps> = ({ id, children }) => {
  return (
    <Band gridless id={id}>
      <div className="grid grid-cols-1fr12rem gap-8 pb-8 md:pl-4 text-xl">
        {children}
      </div>
    </Band>
  );
};

export default DetailsBand;

import Band from "../Band";
