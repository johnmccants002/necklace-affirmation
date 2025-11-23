"use client";

import { Playfair_Display, Space_Grotesk } from "next/font/google";
import { useId, useMemo, useState } from "react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-space-grotesk",
});

const affirmations = [
  "You radiate kindness, and the world mirrors it back to you.",
  "Your light makes every room softer and every heart warmer.",
  "You are resilient, brilliant, and beautifully unstoppable.",
  "Your dreams are valid, gorgeous, and entirely within reach.",
  "You carry grace in your smile and courage in your heart.",
  "You are more than enough exactly as you are today.",
  "Your softness is your strength and your sparkle is endless.",
  "You are the main character and the plot always favors you.",
  "You bloom in your own season, and it is breathtaking to watch.",
  "You deserve every good thing finding its way to you.",
];

type Heart = {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  hue: number;
  start: string;
};

const accentGradients = [
  "from-rose-200 via-pink-100 to-amber-100",
  "from-pink-100 via-rose-50 to-fuchsia-100",
  "from-amber-100 via-rose-50 to-pink-100",
];

const HEART_COUNT = 32;

function pickRandomAffirmation(
  current: string | null,
  randomizer: () => number = Math.random,
) {
  const pool = affirmations.filter((item) => item !== current);
  const target = pool[Math.floor(randomizer() * pool.length)] ?? affirmations[0];
  return target;
}

function createHearts(randomizer: () => number = Math.random): Heart[] {
  return Array.from({ length: HEART_COUNT }, (_, id) => {
    const size = 18 + randomizer() * 28;
    return {
      id,
      left: `${randomizer() * 100}%`,
      start: `${35 + randomizer() * 80}%`,
      size,
      duration: 9 + randomizer() * 6,
      delay: randomizer() * 5,
      hue: randomizer() * 50 - 10,
    };
  });
}

function createRandom(seed: string) {
  let state = 0;
  for (let i = 0; i < seed.length; i += 1) {
    state = (state + seed.charCodeAt(i) * (i + 3)) % 2147483647;
  }
  if (state === 0) state = 137;

  return () => {
    state = (state * 48271) % 2147483647;
    return (state & 0x7fffffff) / 2147483647;
  };
}

export default function Home() {
  const seed = useId();
  const initial = useMemo(() => {
    const randomizer = createRandom(seed);
    return {
      accent:
        accentGradients[Math.floor(randomizer() * accentGradients.length)],
      message: pickRandomAffirmation(null, randomizer),
      hearts: createHearts(randomizer),
    };
  }, [seed]);

  const [message, setMessage] = useState<string>(initial.message);
  const [hearts, setHearts] = useState<Heart[]>(initial.hearts);
  const [accent, setAccent] = useState(initial.accent);

  const shuffle = () => {
    setMessage((current) => pickRandomAffirmation(current));
    setHearts(createHearts());
    setAccent(
      accentGradients[Math.floor(Math.random() * accentGradients.length)],
    );
  };

  return (
    <div
      className={`relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b ${accent} px-6 py-12 text-rose-900`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.45),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.38),transparent_35%),radial-gradient(circle_at_50%_60%,rgba(255,255,255,0.3),transparent_40%)] blur-3xl opacity-70" />

      <div className="absolute inset-0 pointer-events-none">
        {hearts.map((heart) => (
          <span
            key={heart.id}
            className="heart-float absolute flex items-center justify-center"
            style={{
              left: heart.left,
              top: heart.start,
              width: heart.size,
              height: heart.size,
              animationDuration: `${heart.duration}s`,
              animationDelay: `${heart.delay}s`,
              filter: `hue-rotate(${heart.hue}deg) drop-shadow(0 6px 12px rgba(244,114,182,0.15))`,
            }}
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-full w-full text-rose-400 opacity-80"
            >
              <path
                fill="currentColor"
                d="M12 21s-7.25-4.35-9.5-9.2C1 8 3 5 5.7 4.3 7.6 3.8 9.9 4.5 12 7c2.1-2.5 4.4-3.2 6.3-2.7 2.7.7 4.7 3.7 3.2 7.5C19.25 16.65 12 21 12 21z"
              />
            </svg>
          </span>
        ))}
      </div>

      <main
        className={`relative z-10 flex w-full max-w-3xl flex-col items-center gap-10 rounded-[28px] border border-white/30 bg-white/40 px-8 py-12 text-center shadow-[0_25px_120px_rgba(244,114,182,0.25)] backdrop-blur-2xl sm:px-12`}
      >
        <p
          className={`${playfair.className} mt-2 text-balance text-3xl font-semibold leading-snug text-rose-800 drop-shadow-[0_6px_18px_rgba(255,255,255,0.8)] sm:text-4xl`}
        >
          “{message}”
        </p>

        <button
          type="button"
          onClick={shuffle}
          className={`${spaceGrotesk.className} inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_50px_rgba(236,72,153,0.45)] transition hover:scale-[1.02] hover:shadow-[0_18px_60px_rgba(236,72,153,0.55)] active:scale-[0.99]`}
        >
          New affirmation
          <span className="text-lg">✧</span>
        </button>
      </main>
    </div>
  );
}
