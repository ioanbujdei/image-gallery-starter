import {
  ArrowDownTrayIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { variants } from "../utils/animationVariants";
import downloadPhoto from "../utils/downloadPhoto";
import type { ImageProps, SharedModalProps } from "../utils/types";

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

  // Filter for 'Related' images (e.g., the next 6 images in the gallery)
  const relatedImages = images?.filter((img) => img.id !== index).slice(0, 6);

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
      <div
        className="relative z-50 flex h-full w-full max-w-7xl flex-col wide:flex-row items-center justify-center overflow-hidden"
        {...handlers}
      >
        {/* Left Side: The Image Area (Arrows Removed) */}
        <div className="relative flex-grow h-1/2 wide:h-full w-full wide:w-3/4 overflow-hidden flex items-center justify-center p-4">
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
                  className="object-contain"
                  onLoad={() => setLoaded(true)}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: The Details Panel with Related Thumbnails */}
        <div className="h-1/2 wide:h-full w-full wide:w-1/4 bg-black/40 backdrop-blur-xl p-6 flex flex-col text-white border-t wide:border-t-0 wide:border-l border-white/10 overflow-y-auto">
          <div className="flex-grow">
            <h2 className="text-xl font-bold tracking-tight">Painting Details</h2>
            
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-white/50">Artist</h3>
                <p className="text-base font-medium mt-0.5">{currentImage.artist || "Placeholder Artist"}</p>
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-white/50">Medium & Year</h3>
                <p className="text-sm mt-0.5">{currentImage.year || "Oil on Canvas, 2024"}</p>
              </div>
              
              {/* Related Paintings Section */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-[10px] uppercase tracking-widest text-white/50 mb-3">Related Paintings</h3>
                <div className="grid grid-cols-3 gap-2">
                  {relatedImages?.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => changePhotoId(img.id)}
                      className="relative aspect-square overflow-hidden rounded-md border border-white/10 transition hover:border-white/50"
                    >
                      <Image
                        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_thumb,w_200,h_200,g_auto/${img.public_id}.${img.format}`}
                        alt="Related painting"
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center gap-3">
             <button
              onClick={() => closeModal()}
              className="flex-grow rounded-md bg-white/10 px-4 py-2 text-xs font-medium hover:bg-white/20 transition"
            >
              Close
            </button>
            <button
              onClick={() => downloadPhoto(`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${currentImage.public_id}.${currentImage.format}`, `${index}.jpg`)}
              className="rounded-md bg-white p-2 text-black hover:bg-white/90 transition"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
