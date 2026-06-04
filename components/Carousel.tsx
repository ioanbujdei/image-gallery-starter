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
  const [direction, setDirection] = useState(0);

  function closeModal() {
    let returnId = index;
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

  function changePhotoId(newVal: number, newDirection?: number) {
    if (newDirection !== undefined) {
      setDirection(newDirection);
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
      <button
        className="absolute inset-0 z-30 cursor-default bg-black/80 backdrop-blur-2xl"
        onClick={closeModal}
      />
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
