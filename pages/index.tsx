import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Bridge from "../components/Icons/Bridge";
import Logo from "../components/Icons/Logo";
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

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <Head>
        <title>Alpha01 Exhibition</title>
        <meta
          property="og:image"
          content="https://nextjsconf-pics.vercel.app/og-image.png"
        />
        <meta
          name="twitter:image"
          content="https://nextjsconf-pics.vercel.app/og-image.png"
        />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
{/* Gallery Grid: Switched from columns to a standard square grid */}
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
  
  {/* The Hero Box (now takes up one grid slot) */}
  <div className="relative flex h-full min-h-[400px] flex-col items-center justify-center gap-2 overflow-hidden rounded-lg bg-white/10 px-6 text-center text-white shadow-highlight">
    <Image
      src="/alpha-logo.png"
      alt="Alpha Logo"
      width={240}
      height={140}
      className="z-10"
      priority
    />
    <h1 
      className="mt-4 text-2xl font-medium uppercase tracking-[0.2em]"
      style={{ fontFamily: 'Times New Roman, Times, serif' }}
    >
      Alpha01 Exhibition
    </h1>
  </div>

  {/* Image Square Grid */}
  {images.map(({ id, public_id, format, blurDataUrl }) => (
    <Link
      key={id}
      href={`/?photoId=${id}`}
      as={`/p/${id}`}
      ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
      shallow
      className="group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-lg after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
    >
      <Image
        alt="Painting"
        className="h-full w-full object-cover transition duration-300 group-hover:scale-110 group-hover:brightness-110"
        placeholder="blur"
        blurDataURL={blurDataUrl}
        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,ar_1:1,g_auto,w_720/${public_id}.${format}`}
        fill // Use fill for square containers
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
      />
    </Link>
  ))}
</div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        Thank you to{" "}
        <a
          href="https://edelsonphotography.com/"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          Josh Edelson
        </a>
        ,{" "}
        <a
          href="https://www.newrevmedia.com/"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          Jenny Morgan
        </a>
        , and{" "}
        <a
          href="https://www.garysextonphotography.com/"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          Gary Sexton
        </a>{" "}
        for the pictures.
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
