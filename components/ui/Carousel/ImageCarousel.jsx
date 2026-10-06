"use client"; // if you're using this in a Next.js app

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";


export default function ImageCarousel({
  images,
  interval = 1500,
  height = "h-64",
}) {
  const [index, setIndex] = useState(0);
// console.log(images, "<============== images");

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images?.length, interval]);

  return (
    <div className={`relative w-full ${height} overflow-hidden rounded-xl border`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={images[index]}
            alt={images[index]}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-35 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${i === index ? "bg-accent" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
}
