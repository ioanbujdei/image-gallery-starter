import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import type { ImageProps } from "../utils/types";
import SharedModal from "./SharedModal";

export default function Modal({
  images,
  onClose,
}: {
  images: ImageProps[];
  onClose?: () => void;
}) {
  let overlayRef = useRef();
  const router = useRouter();

  const { photoId } = router.query;
  let index = Number(photoId);

  const [direction, setDirection] = useState(0);
  const [curIndex, setCurIndex] = useState(index);

  function handleClose() {
    router.push("/", undefined, { shallow: true });
    onClose();
  }

  function changePhotoId(newVal: number) {
    const currentImg = images.find(img => img.id === curIndex);
    const nextImg = images.find(img => img.id === newVal);
    
    if (currentImg && nextImg) {
      // Check alphabetical sequence order to match the thumbnail layout line exactly
      if (nextImg.public_id.localeCompare(currentImg.public_id) > 0) {
        setDirection(1);
      } else {
        setDirection(-1);
      }
    } else {
      if (newVal > curIndex) {
        setDirection(1);
      } else {
        setDirection(-1);
      }
    }
    
    setCurIndex(newVal);

    router.push(
      `/?photoId=${newVal}`,
      `/p/${newVal}`,
      { shallow: true }
    );
  }

  return (
    <Dialog
      static
      open={true}
      onClose={handleClose}
      initialFocus={overlayRef}
      className="fixed inset-0 z-10 flex items-center justify-center"
    >
      <Dialog.Overlay
        ref={overlayRef}
        as={motion.div}
        key="backdrop"
        className="fixed inset-0 z-30 bg-black/70 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <SharedModal
        index={curIndex}
        direction={direction}
        images={images}
        changePhotoId={changePhotoId}
        closeModal={handleClose}
        navigation={true}
      />
    </Dialog>
  );
}
