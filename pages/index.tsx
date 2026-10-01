import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const Home: NextPage = () => (
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
          <Link
            href="/archive"
            className="mt-2 text-sm uppercase underline underline-offset-4 hover:text-white/70"
          >
            Archive
          </Link>
          <p className="text-xs text-white/70">
            Alpha.1 Exhibition opened: DD.MM.YYYY
          </p>
        </div>
      </div>
    </main>
    <footer className="p-6 text-center text-white/80 sm:p-12">
      A project of the Paul-talk Discord server.
    </footer>
  </>
);

export default Home;
