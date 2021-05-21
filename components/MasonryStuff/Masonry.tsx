type MasonryProps = {
  cards: {
    height: number;
    color?: string;
  }[];
  columns: number;
};

const Masonry: React.FC<MasonryProps> = ({ cards, columns }) => {
  const { t } = useTranslation("common");

  const [measureRef, { width }] = useMeasure();

  const [...items] = cards;

  let heights = new Array(columns).fill(0); // Each column gets a height starting with zero

  let gridItems = items.map((child, i) => {
    const column = heights.indexOf(Math.min(...heights)); // Basic masonry-grid placing, puts tile into the smallest column using Math.min
    const x = (width / columns) * column;
    const y = (heights[column] += child.height / 2) - child.height / 2;
    // X = container width / number of columns * column index, Y = the height of the current column
    return { ...child, x, y, width: width / columns, height: child.height / 2 };
  });
  return (
    <div
      ref={measureRef}
      style={{ height: `${Math.max(...heights)}px` }}
      className="relative w-full h-full"
    >
      {gridItems.map((gridItem, index) => (
        <motion.div
          className="absolute transition-all p-2"
          key={index}
          initial="initial"
          style={{
            x: gridItem.x,
            y: gridItem.y,
            width: gridItem.width,
            height: gridItem.height,
          }}
        >
          <div
            className={`bg-${
              cards[index].color ? cards[index].color : "red"
            }-500 h-full flex items-center justify-center text-2xl md:text-4xl shadow-lg`}
          >
            {index + 1}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Masonry;

import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import useMeasure from "react-use-measure";
