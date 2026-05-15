import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Modal from "../components/Modal";
import cloudinary from "../utils/cloudinary";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";

const Home: NextPage = ({ images }: { images: ImageProps[] }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  // Filter out images that contain "-detail" in their ID for the main grid
  const mainImages = images.filter(img => !img.public_id.includes("-detail"));

  useEffect(() => {
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <Head>
        <title>Alpha01 Exhibition</title>
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={images} // Pass ALL images to the modal so it can find the details
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        
        {/* Main Grid Container */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          
          {/* THE RESTORED HERO BOX */}
          <div className="relative flex aspect-square flex-col items-center justify-center gap-2 overflow-hidden rounded-lg bg-white/10 px-6 text-center text-white shadow-highlight">
            <Image
              src="/alpha-logo.png"
              alt="Alpha Logo"
              width={240}
              height={140}
              className="z-10"
              priority
            />
            <h1 
              className="mt-4 text-xl font-medium uppercase tracking-[0.2em]"
              style={{ fontFamily: 'Times New Roman, Times, serif' }}
            >
              Alpha.1 Exhibition
            </h1>
          </div>

          {/* Painting Grid Items (Using mainImages only) */}
          {mainImages.map(({ id, public_id, format, blurDataUrl }) => (
            <Link
              key={id}
              href={`/?photoId=${id}`}
              as={`/p/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className="group relative aspect-square flex items-center justify-center overflow-hidden rounded-lg bg-white/5 after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt="Painting"
                className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105 group-hover:brightness-110"
                placeholder="blur"
                blurDataURL={blurDataUrl}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_limit,w_720,h_720/${public_id}.${format}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
              />
            </Link>
          ))}
        </div>
      </main>
      
      <footer className="p-6 text-center text-white/80 sm:p-12">
        A project of the Paul-talk Discord server.
      </footer>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .with_field('context')
    .execute();
    
  let reducedResults: ImageProps[] = [];

  let i = 0;
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
      artist: result.context?.artist || "",
      year: result.context?.year || "",
      description: result.context?.description || "",
    });
    i++;
  }

  const blurImagePromises = results.resources.map((image: ImageProps) => {
    return getBase64ImageUrl(image);
  });
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
  }

  return {
    props: {
      images: reducedResults,
    },
  };
}
