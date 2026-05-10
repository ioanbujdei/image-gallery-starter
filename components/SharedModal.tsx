import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUturnLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { variants } from "../utils/animationVariants";
import downloadPhoto from "../utils/downloadPhoto";
import { range } from "../utils/range";
import type { ImageProps, SharedModalProps } from "../utils/types";
import Twitter from "./Icons/Twitter";

export default function SharedModal({
  index,
  images,
  changePhotoId,
  closeModal,
  navigation,
  currentPhoto,
  direction,
}: SharedModalProps) {
  const [loaded, setLoaded] = useState(false);

  let filteredImages = images?.filter((img: ImageProps) =>
    range(index - 15, index + 15).includes(img.id),
  );

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (index < images?.length - 1) {
        changePhotoId(index + 1);
      }
    },
    onSwipedRight: () => {
      if (index > 0) {
        changePhotoId(index - 1);
      }
    },
    trackMouse: true,
  });

  let currentImage = images ? images[index] : currentPhoto;

  return (
    <MotionConfig
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      {/* Main Container: Changed to h-full and added lg:flex-row for the side panel */}
      <div
        className="relative z-50 flex h-full w-full max-w-7xl flex-col lg:flex-row items-center justify-center overflow-hidden"
        {...handlers}
      >
        {/* Left Side: The Image (takes 75% width on desktop) */}
        <div className="relative flex-grow h-full w-full lg:w-3/4 overflow-hidden flex items-center justify-center p-4">
          <div className="relative h-full w-full">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <Image
                  src={`https://res.cloudinary.com/${
                    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                  }/image/upload/c_scale,${navigation ? "w_1280" : "w_1920"}/${
                    currentImage.public_id
                  }.${currentImage.format}`}
                  fill
                  priority
                  alt="Gallery image"
                  className="object-contain" // This ensures the image is never bigger than the screen
                  onLoad={() => setLoaded(true)}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation Buttons (kept over the image area) */}
          {loaded && navigation && (
            <>
              {index > 0 && (
                <button
                  className="absolute left-6 z-50 rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                  onClick={() => changePhotoId(index - 1)}
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
              )}
              {index + 1 < images.length && (
                <button
                  className="absolute right-6 z-50 rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                  onClick={() => changePhotoId(index + 1)}
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              )}
            </>
          )}
        </div>

      {/* Right Side: The Details Panel (takes 25% width on desktop) */}
<div className="h-auto lg:h-full w-full lg:w-1/4 bg-black/20 lg:bg-black/40 backdrop-blur-xl p-6 lg:p-8 flex flex-col text-white border-t lg:border-t-0 lg:border-l border-white/10">
  <div className="flex-grow">
    <h2 className="text-xl lg:text-2xl font-bold tracking-tight">Painting Details</h2>
    <div className="mt-4 lg:mt-8 space-y-4 lg:space-y-6">
      <div>
        <h3 className="text-[10px] lg:text-xs uppercase tracking-widest text-white/50">Artist</h3>
        <p className="text-base lg:text-lg font-medium mt-1">Placeholder Artist Name</p>
      </div>
      <div>
        <h3 className="text-[10px] lg:text-xs uppercase tracking-widest text-white/50">Medium & Year</h3>
        <p className="text-sm lg:text-base mt-1">Oil on Canvas, 2024</p>
      </div>
      <div>
        <h3 className="text-[10px] lg:text-xs uppercase tracking-widest text-white/50">Description</h3>
        <p className="text-xs lg:text-sm text-white/70 leading-relaxed mt-2">
          This is a placeholder description for the painting. You can add unique descriptions by updating your Cloudinary metadata or adding a local JSON file with data mapped to the Image ID.
        </p>
      </div>
    </div>
  </div>

  {/* Action Buttons (moved to bottom of panel) */}
  <div className="mt-6 lg:mt-8 flex items-center gap-3">
     <button
      onClick={() => closeModal()}
      className="flex-grow rounded-md bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20 transition"
    >
      {navigation ? "Close" : "Go Back"}
    </button>
    <button
      onClick={() => downloadPhoto(`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${currentImage.public_id}.${currentImage.format}`, `${index}.jpg`)}
      className="rounded-md bg-white p-2 text-black hover:bg-white/90 transition"
      title="Download"
    >
      <ArrowDownTrayIcon className="h-5 w-5" />
    </button>
  </div>
</div>
      </div>
    </MotionConfig>
  );
}
