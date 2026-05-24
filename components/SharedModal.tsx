import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import type { ImageProps, SharedModalProps } from "../utils/types";

// GPU accelerated slide animation variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 32 },
      opacity: { duration: 0.25 },
    },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 32 },
      opacity: { duration: 0.25 },
    },
  }),
};

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
  const [revealContact, setRevealContact] = useState(false); 
  
  let currentImage = images ? images[index] : currentPhoto;

  const baseId = currentImage.public_id.split("-detail")[0];
  
  const mainImage = images?.find((img) => img.public_id === baseId) || currentImage;

  const detailShots = images
    ?.filter((img) => 
      img.public_id === baseId || img.public_id.startsWith(baseId + "-detail")
    )
    .sort((a, b) => a.public_id.localeCompare(b.public_id));

  useEffect(() => {
    setRevealContact(false);
  }, [index]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIdxInDetails = detailShots?.findIndex(img => img.id === index);
      if (currentIdxInDetails !== undefined && currentIdxInDetails !== -1 && currentIdxInDetails < detailShots.length - 1) {
        changePhotoId(detailShots[currentIdxInDetails + 1].id);
      }
    },
    onSwipedRight: () => {
      const currentIdxInDetails = detailShots?.findIndex(img => img.id === index);
      if (currentIdxInDetails !== undefined && currentIdxInDetails > 0) {
        changePhotoId(detailShots[currentIdxInDetails - 1].id);
      }
    },
    trackMouse: true,
  });

  return (
    <MotionConfig>
      <div
        className="relative z-50 flex h-full w-full max-w-7xl flex-col wide:flex-row items-center justify-center overflow-hidden"
        {...handlers}
      >
        {/* Left Side: Large Image Area */}
        <div className="relative flex-grow h-1/2 wide:h-full w-full wide:w-3/4 overflow-hidden flex items-center justify-center p-4">
          <div className="relative h-full w-full flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute w-full h-full flex items-center justify-center"
              >
                <Image
                  src={`https://res.cloudinary.com/${
                    process.env.NEXT_PUBLIC_CLOC_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                  }/image/upload/${currentImage.version ? `v${currentImage.version}/` : ''}c_scale,${navigation ? "w_1280" : "w_1920"}/${
                    currentImage.public_id
                  }.${currentImage.format}`}
                  fill
                  priority
                  alt="Gallery image"
                  className="object-contain select-none pointer-events-none"
                  onLoad={() => setLoaded(true)}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Details Panel */}
        <div className="h-1/2 wide:h-full w-full wide:w-1/4 bg-black/40 backdrop-blur-xl p-6 flex flex-col text-white border-t wide:border-t-0 wide:border-l border-white/10 overflow-y-auto">
          <div className="flex-grow">
            <div className="space-y-6">
              
              {/* Group 1: Artist, Location, Contact, About */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-white/50">Artist</h3>
                  <p className="text-sm font-medium mt-0.5">{mainImage.context?.artist || "-"}</p>
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-white/50">Location</h3>
                  <p className="text-sm font-medium mt-0.5">{mainImage.context?.location || "-"}</p>
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-white/50">Contact</h3>
                  {mainImage.context?.contact ? (
                    revealContact ? (
                      <p className="text-sm font-medium mt-0.5 break-all select-all selection:bg-white/20">
                        {mainImage.context.contact}
                      </p>
                    ) : (
                      <button
                        onClick={() => setRevealContact(true)}
                        className="inline-block text-xs font-medium mt-1 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded border border-white/10 text-white/80 hover:text-white transition cursor-pointer"
                      >
                        Reveal
                      </button>
                    )
                  ) : (
                    <p className="text-sm font-medium mt-0.5">-</p>
                  )}
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-white/50">About</h3>
                  <p className="text-sm font-medium mt-0.5">{mainImage.context?.about || "-"}</p>
                </div>
              </div>

              {/* Group 2: Title, Medium, Size, Status */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-white/50">Title</h3>
                  <p className="text-sm font-medium mt-0.5">{mainImage.context?.title || "-"}</p>
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-white/50">Medium</h3>
                  <p className="text-sm font-medium mt-0.5">{mainImage.context?.medium || "-"}</p>
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-white/50">Size</h3>
                  <p className="text-sm font-medium mt-0.5">{mainImage.context?.size || "-"}</p>
                </div>
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-white/50">Status</h3>
                  <p className="text-sm font-medium mt-0.5">{mainImage.context?.status || "-"}</p>
                </div>
              </div>

              {/* Optional Description */}
              {mainImage.context?.description && (
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-[10px] uppercase tracking-widest text-white/50">Description</h3>
                  <p className="text-xs text-white/70 leading-relaxed mt-1">
                    {mainImage.context.description}
                  </p>
                </div>
              )}

              {/* Detail Shots Section */}
              {detailShots && detailShots.length > 1 && (
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
                          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${img.version ? `v${img.version}/` : ''}c_fill,w_200,h_200/${img.public_id}.${img.format}`}
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
