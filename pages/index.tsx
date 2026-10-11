import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import cloudinary from "../utils/cloudinary";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { ImageProps } from "../utils/types";

const Home: NextPage<{ images: ImageProps[] }> = ({ images }) => {
  const mainImages = images.filter((image) => !image.public_id.includes("-detail"));

  return (
    <>
      <Head>
        <title>Alpha.2 Exhibition</title>
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
              Alpha.2 Exhibition
            </h1>
            <p className="text-sm uppercase tracking-[0.15em] text-white/80">
              Opened: DD.MM.YYYY
            </p>
          </div>

          {mainImages.map(({ id, public_id, format, version, blurDataUrl }) => (
            <Link
              key={id}
              href={`/p/exhibition2-${id}`}
              className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-white/5 after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt="Painting"
                className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105 group-hover:brightness-110"
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_limit,w_720,h_720/${version ? `v${version}/` : ""}${public_id}.${format}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
                placeholder={blurDataUrl ? "blur" : "empty"}
                blurDataURL={blurDataUrl}
              />
            </Link>
          ))}
        </div>
      </main>
      <footer className="flex flex-col items-center gap-4 p-6 text-center text-white/80 sm:p-12">
        <Link
          href="/archive"
          className="rounded-full border border-white/25 px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors hover:border-white/50 hover:bg-white/10 hover:text-white"
        >
          Archive
        </Link>
        <p>A project of the Paul-talk Discord server.</p>
      </footer>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/Exhibition2/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .with_field("context")
    .execute()
    .catch(() => {
      throw new Error(
        "Unable to load Exhibition2 images. Verify the Cloudinary credentials and folder.",
      );
    });

  let images: ImageProps[] = results.resources.map((result: any) => ({
    id: 0,
    height: result.height,
    width: result.width,
    public_id: result.public_id,
    format: result.format,
    version: result.version ? result.version.toString() : "",
    context: result.context || {},
  }));

  images.sort((a, b) => {
    const orderA = a.context?.order ? parseInt(a.context.order, 10) : 999;
    const orderB = b.context?.order ? parseInt(b.context.order, 10) : 999;
    return orderA - orderB;
  });

  images = images.map((image, index) => ({ ...image, id: index }));
  const blurImagePromises = images.map((image) => getBase64ImageUrl(image));
  const blurDataUrls = await Promise.all(blurImagePromises);

  images = images.map((image, index) => ({
    ...image,
    blurDataUrl: blurDataUrls[index],
  }));

  return {
    props: { images },
    revalidate: 60,
  };
};
