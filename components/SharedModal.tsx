import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { variants } from "../utils/animationVariants";
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
  let currentImage = images ? images[index] : currentPhoto;

  // Logic to find "Detail" shots and the Main Image:
  // 1. Get the base ID (e.g., 'painting-1' from 'painting-1-detail-01')
  const baseId = currentImage.public_id.split("-detail")[0];
  
  // 2. Find all images that share that base ID and explicitly sort them ascending by public_id
  const detailShots = images
    ?.filter((img) => 
      img.public_id === baseId || img.public_id.startsWith(baseId + "-detail")
    )
    .sort((a, b) => a.public_id.localeCompare(b.public_id));

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
        {/* Left Side: Large Image Area */}
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
                    process.env.NEXT_PUBLIC_CLOC_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
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

        {/* Right Side: Details Panel */}
        <div className="h-1/2 wide:h-full w-full wide:w-1/4 bg-black/40 backdrop-blur-xl p-6 flex flex-col text-white border-t wide:border-t-0 wide:border-l border-white/10 overflow-y-auto">
          <div className="flex-grow">
            
            <div className="space-y-4">
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-white/50">Artist</h3>
                <p className="text-base font-medium mt-0.5">{currentImage.artist || "Unknown Artist"}</p>
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-white/50">Medium & Year</h3>
                <p className="text-sm mt-0.5">{currentImage.year || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-white/50">Description</h3>
                <p className="text-xs text-white/70 leading-relaxed mt-1">
                  {currentImage.description || "No description available."}
                </p>
              </div>

              {/* Detail Shots Section */}
              {detailShots && detailShots.length > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-[10px] uppercase tracking-widest text-white/50 mb-3">Detail Views</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {detailShots.map((img) => (
                      <button
                        key={img.id}
                        onClick={() => changePhotoId(img.id)}
                        className={`relative aspect-square overflow-hidden rounded-md border transition ${
                          img.id === index
                            ? "border-white ring-2 ring-white/40 bg-white/10 scale-95"
                            : "border-white/10 hover:border-white/40"
                        }`}
                      >
                        <Image
                          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_thumb,w_200,h_200,g_auto/${img.public_id}.${img.format}`}
                          alt="Detail view"
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
