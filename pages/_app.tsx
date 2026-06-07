import type { AppProps } from "next/app";
import Head from "next/head";
import Image from "next/image";
import "../styles/index.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  // This checks your Vercel settings to see if the site should be locked
  const isLocked = process.env.NEXT_PUBLIC_SITE_LOCKED === "true";

  if (isLocked) {
    return (
      <>
        <Head>
          <title>Alpha.1 Exhibition - Coming Soon</title>
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
          <div className="relative flex w-full max-w-lg flex-col items-center justify-center gap-6 overflow-hidden rounded-lg bg-white/5 p-12 text-center text-white shadow-highlight border border-white/10 backdrop-blur-md">
            <div className="relative h-32 w-48 mb-4 opacity-80">
              <Image
                src="/alpha-logo.png"
                alt="Alpha Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            
            <h1 
              className="text-2xl sm:text-3xl font-medium uppercase tracking-[0.2em]"
              style={{ fontFamily: 'Times New Roman, Times, serif' }}
            >
              Alpha.1 Exhibition
            </h1>
            
            <div className="h-px w-16 bg-white/20 my-2" />
            
            <p className="text-sm font-medium uppercase tracking-widest text-white/50">
              Opening 10 June 2026
            </p>
          </div>
        </main>
      </>
    );
  }

  // If the lock is false, show the actual website
  return <Component {...pageProps} />;
}
