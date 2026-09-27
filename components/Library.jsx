"use client";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import WorkoutCard from "./WorkoutCard";
import { API_URL } from "@/lib/api";
export default function Library() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("duration");
  const [error, setError] = useState("");
  useEffect(() => {
    fetch(API_URL)
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then(setData)
      .catch(() => setError("Unable to load workouts right now."))
      .finally(() => setLoading(false));
  }, []);
  const sorted = useMemo(
    () => [...data].sort((a, b) => b[sort] - a[sort]),
    [data, sort],
  );
  return (
    <section id="library" className="py-14 md:py-20">
      <div className="container-fit">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h2 className="display mt-2 text-5xl font-black uppercase">
              THE LIBRARY
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Twelve lifts covering every major muscle group.
            </p>
          </div>
          <label className="flex items-center gap-3 text-xs font-bold uppercase text-white/55">
            Sort By{" "}
            <span className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none rounded-md border border-[#444] bg-[#171717] px-4 py-3 pr-9 text-xs font-bold text-white outline-none"
              >
                <option value="duration">Duration</option>
                <option value="caloriesBurned">Calories</option>
                <option value="rating">Rating</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
              />
            </span>
          </label>
        </div>
        {loading ? (
          <div className="grid min-h-72 place-items-center rounded-xl border border-[#303030] bg-[#151515]">
            <div className="flex items-center gap-3 text-sm text-white/60">
              <span className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-[var(--lime)]" />{" "}
              Loading workouts…
            </div>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-900 bg-red-950/20 p-8 text-center text-sm text-red-200">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((w) => (
              <WorkoutCard key={w.id} workout={w} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
