import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Carousel from "../../components/Carousel";
import getResults from "../../utils/cachedImages";
import cloudinary from "../../utils/cloudinary";
import getBase64ImageUrl from "../../utils/generateBlurPlaceholder";
import type { ImageProps } from "../../utils/types";

const Home: NextPage<{
  currentPhoto: ImageProps;
  images: ImageProps[];
  photoPathPrefix: string;
}> = ({ currentPhoto, images, photoPathPrefix }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const index = Number(
    photoPathPrefix ? String(photoId).slice(photoPathPrefix.length) : photoId,
  );

  const currentPhotoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_2560/${currentPhoto.version ? `v${currentPhoto.version}/` : ''}${currentPhoto.public_id}.${currentPhoto.format}`;

  return (
    <>
      <Head>
        <title>Alpha.1 Exhibition</title>
        <meta property="og:image" content={currentPhotoUrl} />
        <meta name="twitter:image" content={currentPhotoUrl} />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel
          currentPhoto={currentPhoto}
          index={index}
          images={images}
          photoPathPrefix={photoPathPrefix}
        />
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  const pathPhotoId = String(context.params?.photoId);
  const photoPathPrefix = pathPhotoId.startsWith("exhibition2-")
    ? "exhibition2-"
    : "";
  const photoId = photoPathPrefix
    ? pathPhotoId.slice(photoPathPrefix.length)
    : pathPhotoId;
  const results = await getResults(photoPathPrefix ? "Exhibition2" : "");

  let reducedResults: ImageProps[] = [];
  for (let result of results.resources) {
    reducedResults.push({
      id: 0, // Placeholder
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
      version: result.version ? result.version.toString() : "",
      context: result.context || {}, 
    });
  }

  // JAVASCRIPT CUSTOM SORTING
  reducedResults.sort((a, b) => {
    const orderA = a.context?.order ? parseInt(a.context.order, 10) : 999;
    const orderB = b.context?.order ? parseInt(b.context.order, 10) : 999;
    return orderA - orderB;
  });

  // Re-assign IDs
  reducedResults = reducedResults.map((img, index) => ({
    ...img,
    id: index
  }));

  const currentPhoto = reducedResults.find(
    (img) => img.id === Number(photoId),
  );
  
  if (currentPhoto) {
    currentPhoto.blurDataUrl = await getBase64ImageUrl(currentPhoto);
  }

  return {
    props: {
      currentPhoto: currentPhoto || null,
      images: reducedResults,
      photoPathPrefix,
    },
    revalidate: 60,
  };
};

export async function getStaticPaths() {
  const [archiveResults, exhibitionResults] = await Promise.all([
    cloudinary.v2.search
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}`)
      .sort_by("public_id", "desc")
      .max_results(400)
      .execute(),
    cloudinary.v2.search
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}/Exhibition2/*`)
      .sort_by("public_id", "desc")
      .max_results(400)
      .execute(),
  ]);

  const fullPaths = [];
  for (let i = 0; i < archiveResults.resources.length; i++) {
    fullPaths.push({ params: { photoId: i.toString() } });
  }
  for (let i = 0; i < exhibitionResults.resources.length; i++) {
    fullPaths.push({ params: { photoId: `exhibition2-${i}` } });
  }

  return {
    paths: fullPaths,
    fallback: false,
  };
}
