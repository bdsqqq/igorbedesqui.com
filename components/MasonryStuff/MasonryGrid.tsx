type MasonryProps = {
  cards: {
    height: number;
    color?: string;
  }[];
  columns: number;
};

const Masonry: React.FC<MasonryProps> = ({ cards, columns }) => {
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
      <AnimatePresence>
        {gridItems.map((gridItem, index) => (
          <motion.div
            className="absolute p-2"
            layout
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              x: gridItem.x,
              y: gridItem.y,
              width: gridItem.width,
              height: gridItem.height,
              willChange: "transform, width, height, opacity",
            }}
          >
            <div
              className={`bg-${
                cards[index].color ? cards[index].color : "red"
              }-400 h-full w-full flex items-center justify-center t-writing-mode-vlr rounded text-2xl md:text-4xl shadow-lg`}
            >
              {index + 1}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <span className="hidden bg-blue-400" />
      <span className="hidden bg-red-400" />
      <span className="hidden bg-yellow-400" />
    </div>
  );
};

export default Masonry;

import { motion, AnimatePresence } from "framer-motion";
import useMeasure from "react-use-measure";
