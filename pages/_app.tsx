import type { AppProps } from "next/app";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import "../styles/index.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [isLocked, setIsLocked] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Target Date: June 15, 2026 at 18:00 (6:00 PM) GMT
    // In JavaScript, Date.UTC(year, monthIndex, day, hour, minute, second)
    // Month is 0-indexed, so June is 5.
    const openingDate = Date.UTC(2026, 5, 15, 18, 0, 0);

    const checkTime = () => {
      const now = new Date().getTime();
      const distance = openingDate - now;

      if (distance <= 0) {
        setIsLocked(false);
      } else {
        // Calculate time remaining
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
        setIsLocked(true);
      }
    };

    // Run once immediately
    checkTime();

    // Update the countdown every second
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Prevent hydration mismatch by returning nothing until the client loads
  if (!isClient) return null;

  // We check the environment variable first. If you want to force unlock it manually
  // before the date, set NEXT_PUBLIC_SITE_LOCKED="false" in Vercel.
  // Otherwise, the timer takes control.
  const isManuallyUnlocked = process.env.NEXT_PUBLIC_SITE_LOCKED === "false";

  if (isLocked && !isManuallyUnlocked) {
    return (
      <>
        <Head>
          <title>Alpha.1 Exhibition - Coming Soon</title>
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
          <div className="relative flex w-full max-w-lg flex-col items-center justify-center gap-8 overflow-hidden rounded-lg bg-white/5 p-12 text-center text-white shadow-highlight border border-white/10 backdrop-blur-md">
            <div className="relative h-32 w-48 mb-2 opacity-80">
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
            
            <div className="h-px w-16 bg-white/20" />
            
            <div className="flex flex-col items-center gap-2">
              <p className="text-[10px] font-medium uppercase tracking-widest text-white/50">
                Opening in
              </p>
              
              {/* Countdown Display */}
              <div className="flex items-center justify-center gap-4 sm:gap-6 mt-2">
                <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-light" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                    {timeLeft.days.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-white/40 mt-1">Days</span>
                </div>
                <span className="text-xl text-white/20 pb-4">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-light" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-white/40 mt-1">Hrs</span>
                </div>
                <span className="text-xl text-white/20 pb-4">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-light" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-white/40 mt-1">Min</span>
                </div>
                <span className="text-xl text-white/20 pb-4">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-light" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-white/40 mt-1">Sec</span>
                </div>
              </div>
            </div>
            
            <p className="mt-4 text-[11px] uppercase tracking-widest text-white/40">
              15 June 2026 • 18:00 GMT
            </p>

          </div>
        </main>
      </>
    );
  }

  // If the countdown is finished (or manually unlocked), show the actual website
  return <Component {...pageProps} />;
}
