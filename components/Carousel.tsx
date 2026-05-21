import { useRouter } from "next/router";
import { useState } from "react";
import useKeypress from "react-use-keypress";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import SharedModal from "./SharedModal";

export default function Carousel({
  index,
  currentPhoto,
  images,
}: {
  index: number;
  currentPhoto: ImageProps;
  images: ImageProps[];
}) {
  const router = useRouter();
  const [, setLastViewedPhoto] = useLastViewedPhoto();
  
  // Track animation direction for smooth sliding
  const [direction, setDirection] = useState(0);

  function closeModal() {
    let returnId = index;
    
    // Find the parent painting's ID so the grid smoothly scrolls to it
    // even if the user closes the modal while looking at a sub-detail shot.
    if (images) {
      const currentImg = images.find((img) => img.id === index);
      if (currentImg) {
        const baseId = currentImg.public_id.split("-detail")[0];
        const mainImg = images.find((img) => img.public_id === baseId);
        if (mainImg) {
          returnId = mainImg.id;
        }
      }
    }
    
    setLastViewedPhoto(returnId);
    router.push("/", undefined, { shallow: true });
  }

  function changePhotoId(newVal: number) {
    // Calculate animation slide direction based on alphabetical image sort
    if (images) {
      const currentImg = images.find((img) => img.id === index);
      const nextImg = images.find((img) => img.id === newVal);
      
      if (currentImg && nextImg) {
        if (nextImg.public_id.localeCompare(currentImg.public_id) > 0) {
          setDirection(1);
        } else {
          setDirection(-1);
        }
      }
    } else {
      setDirection(newVal > index ? 1 : -1);
    }
    
    router.push(`/p/${newVal}`, undefined, { shallow: true });
  }

  useKeypress("Escape", () => {
    closeModal();
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {/* 1. Completely removed the buggy blurred <Image /> layer */}
      <button
        className="absolute inset-0 z-30 cursor-default bg-black/80 backdrop-blur-2xl"
        onClick={closeModal}
      />
      {/* 2. Passed the missing direction state down to SharedModal */}
      <SharedModal
        index={index}
        direction={direction}
        images={images}
        changePhotoId={changePhotoId}
        currentPhoto={currentPhoto}
        closeModal={closeModal}
        navigation={false}
      />
    </div>
  );
}
