import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
const hero =
  "https://img.magnific.com/free-photo/portrait-anime-character-doing-fitness-exercising_23-2151666664.jpg?w=740";
export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#303030] py-12 md:py-20">
      <div className="container-fit relative grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr]">
        <div>
          <p className="mb-4 text-xs font-extrabold tracking-[.25em] text-[var(--lime)]">
            WORKOUT LIBRARY
          </p>
          <h1 className="display max-w-3xl text-5xl font-black uppercase leading-[.88] sm:text-7xl lg:text-[88px]">
            TRAIN WITH INTENT.{" "}
            <span className="text-[var(--lime)]">LOG EVERY SET.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
            into today's plan, and watch the week's work add up.
          </p>
          <Link
            href="#library"
            className="mt-8 inline-flex items-center gap-3 rounded-md bg-[var(--lime)] px-5 py-3 text-xs font-black tracking-wide text-black"
          >
            BROWSE WORKOUTS <ArrowDownRight size={17} />
          </Link>
        </div>
        <div className="relative aspect-[1.35] overflow-hidden rounded-2xl border border-[#343434] bg-[#222] shadow-[0_20px_70px_rgba(0,0,0,.35)]">
          <Image
            src={hero}
            alt="Workout illustration"
            fill
            priority
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
