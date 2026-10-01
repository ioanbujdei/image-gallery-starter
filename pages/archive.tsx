import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import cloudinary from "../utils/cloudinary";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { ImageProps } from "../utils/types";

const Archive: NextPage = ({ images }: { images: ImageProps[] }) => {
  const mainImages = images.filter((image) => !image.public_id.includes("-detail"));

  return (
    <>
      <Head>
        <title>Old Exposition | Alpha.1 Exhibition</title>
        <meta
          property="og:image"
          content="https://image-gallery-starter-2f4eg0k3q-truepaintings-projects.vercel.app/_next/image?url=%2Falpha-logo.png&w=640&q=75"
        />
        <meta
          name="twitter:image"
          content="https://image-gallery-starter-2f4eg0k3q-truepaintings-projects.vercel.app/_next/image?url=%2Falpha-logo.png&w=640&q=75"
        />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
              style={{ fontFamily: "Times New Roman, Times, serif" }}
            >
              Alpha.1 Exhibition
            </h1>
          </div>

          {mainImages.map(({ id, public_id, format, version }) => (
            <Link
              key={id}
              href={`/p/${id}`}
              className="group relative aspect-square flex items-center justify-center overflow-hidden rounded-lg bg-white/5 after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt="Painting"
                className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105 group-hover:brightness-110"
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_limit,w_720,h_720/${version ? `v${version}/` : ""}${public_id}.${format}`}
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

export default Archive;

export async function getStaticProps() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .with_field("context")
    .execute()
    .catch(() => {
      throw new Error(
        "Unable to load gallery images. Verify the Cloudinary credentials and folder.",
      );
    });

  let reducedResults: ImageProps[] = [];

  for (const result of results.resources) {
    reducedResults.push({
      id: 0,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
      version: result.version ? result.version.toString() : "",
      context: result.context || {},
    });
  }

  reducedResults.sort((a, b) => {
    const orderA = a.context?.order ? parseInt(a.context.order, 10) : 999;
    const orderB = b.context?.order ? parseInt(b.context.order, 10) : 999;
    return orderA - orderB;
  });

  reducedResults = reducedResults.map((image, index) => ({
    ...image,
    id: index,
  }));

  const blurImagePromises = reducedResults.map((image) =>
    getBase64ImageUrl(image),
  );
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let index = 0; index < reducedResults.length; index++) {
    reducedResults[index].blurDataUrl = imagesWithBlurDataUrls[index];
  }

  return {
    props: {
      images: reducedResults,
    },
    revalidate: 60,
  };
}