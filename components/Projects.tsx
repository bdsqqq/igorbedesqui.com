export default function Projects() {
  const images = [
    {
      src: "street.jpg",
      width: 144,
      height: 256,
    },
    {
      src: "background.jpg",
      width: 256,
      height: 144,
    },
    {
      src: "cars.jpg",
      width: 400,
      height: 300,
    },
  ];
  const [currentImage, setCurrentImage] = useState(0);
  const [isGray, setIsGray] = useState(true);

  return (
    <div className="flex flex-col md:flex-row justify-between md:mx-4">
      <ul>
        {images.map((image, i) => {
          return (
            <li
              onClick={() => {
                setIsGray(false);
                setCurrentImage(i);
              }}
              onMouseOver={() => {
                setIsGray(false);
                setCurrentImage(i);
              }}
              onMouseLeave={() => {
                setIsGray(true);
              }}
            >
              {image.src}
            </li>
          );
        })}
      </ul>
      <div className="flex justify-items-center overflow-hidden items-center mx-auto h-96 w-full md:w-96">
        <motion.div
          className="overflow-hidden relative mx-auto"
          animate={{
            width: images[currentImage].width,
            height: images[currentImage].height,
            transition: { duration: 0.4 },
          }}
          exit={{
            width: images[(currentImage + 1) % images.length].width,
            height: images[(currentImage + 1) % images.length].height,
            transition: { duration: 0.2 },
          }}
          initial={false}
        >
          <Image
            src={`/images/${images[currentImage].src}`}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className={`transition-all mx-auto ${
              isGray ? "f-grayscale" : "f-grayscale-off-caralho"
            }`}
          />
        </motion.div>
      </div>
    </div>
  );
}

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
