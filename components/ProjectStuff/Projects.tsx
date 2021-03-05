export default function Projects() {
  const images = [
    {
      src: "street.jpg",
      width: 144,
      height: 256,
    },
    {
      src: "background.jpg",
      width: 30,
      height: 600,
    },
    {
      src: "cars.jpg",
      width: 400,
      height: 600,
    },
  ];
  const [currentImage, setCurrentImage] = useState(0);
  const [isGray, setIsGray] = useState(true);

  return (
    <div className="flex flex-col items-center justify-start min-h-96 md:flex-row md:justify-between">
      <ul className="h-48">
        {images.map((image, i) => {
          return (
            <Link href={`/projects/${image.src}`} passHref key={`li-${i}`}>
              <a
                onFocus={() => {
                  setIsGray(false);
                  setCurrentImage(i);
                }}
                onBlur={() => {
                  setIsGray(true);
                }}
                onMouseOver={() => {
                  setIsGray(false);
                  setCurrentImage(i);
                }}
                onMouseLeave={() => {
                  setIsGray(true);
                }}
              >
                <li
                  className={`my-2 transition-opacity ${
                    i != currentImage && "opacity-70"
                  }`}
                >
                  <span className="font-bold text-lg">{image.src} </span>
                  <span className="font-light opacity-50 mr-1">
                    - FrontEnd dev
                  </span>
                  {i == currentImage ? (
                    <motion.div
                      className="cursor-pointer p-1 pb-0 select-none"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 0.6, x: 0 }}
                      whileHover={{ opacity: 1, x: 10 }}
                      whileFocus={{ opacity: 1, x: 10 }}
                    >
                      leia mais ⟶
                    </motion.div>
                  ) : (
                    <hr className="opacity-50 w-8 mb-2 mt-6" />
                  )}
                </li>
              </a>
            </Link>
          );
        })}
      </ul>
      <div className="h-24 md:hidden" />
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
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
