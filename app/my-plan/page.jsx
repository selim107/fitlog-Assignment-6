'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Check, Clock3, Flame, Star, X, ArrowRight, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePlan } from '@/context/PlanContext';
import { getWorkouts } from '@/lib/api';

function PlanCard({ workout, onRemove, onDone }) {
  return (
    <article
      className={`grid gap-4 rounded-xl border p-3 md:grid-cols-[170px_1fr_auto] ${
        workout.done ? 'border-[var(--lime)]/50 bg-[#182000]' : 'border-[#333] bg-[#171717]'
      }`}
    >
      <div className="relative min-h-[155px] overflow-hidden rounded-lg bg-[#222]">
        <Image
          src={workout.image}
          alt={workout.name}
          fill
          sizes="170px"
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="self-center">
        <div className="flex flex-wrap items-center gap-2">
          {workout.done && (
            <span className="rounded-full bg-[var(--lime)] px-2 py-1 text-[9px] font-black text-black">DONE</span>
          )}
          <h3 className="display text-3xl font-bold uppercase leading-none">{workout.name}</h3>
        </div>
        <p className="mt-2 text-xs text-white/45">{workout.equipment}</p>
        <div className="mt-5 flex flex-wrap gap-4 text-xs text-white/55">
          <span className="flex items-center gap-1"><Clock3 size={14} />{workout.duration} min</span>
          <span className="flex items-center gap-1"><Flame size={14} />{workout.caloriesBurned} kcal</span>
          <span className="flex items-center gap-1 text-[var(--lime)]"><Star size={14} fill="currentColor" />{workout.rating}</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 self-center md:flex-col md:items-stretch">
        <Link
          href={`/workout/${workout.id}`}
          className="rounded-md border border-[#555] px-4 py-2 text-center text-[10px] font-black uppercase transition hover:border-white"
        >
          View Details
        </Link>
        <button
          type="button"
          onClick={() => onDone(workout.id)}
          className="flex items-center justify-center gap-1 rounded-md bg-[var(--lime)] px-4 py-2 text-[10px] font-black uppercase text-black"
        >
          <Check size={14} />{workout.done ? 'Undo' : 'Mark as Done'}
        </button>
        <button
          type="button"
          onClick={() => onRemove(workout.id)}
          className="grid size-9 place-items-center self-end rounded-md border border-[#444] text-white/60 transition hover:border-red-400 hover:text-red-300"
          aria-label={`Remove ${workout.name}`}
        >
          <X size={16} />
        </button>
      </div>
    </article>
  );
}

export default function MyPlan() {
  const { plan, saved, hydrated, removePlan, removeSaved, markDone } = usePlan();
  const [tab, setTab] = useState('plan');
  const [query, setQuery] = useState('');
  const [catalog, setCatalog] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');

  useEffect(() => {
    let cancelled = false;
    getWorkouts()
      .then((items) => {
        if (!cancelled) setCatalog(Array.isArray(items) ? items : []);
      })
      .catch(() => {
        if (!cancelled) setCatalogError('Workout data could not be refreshed. Showing saved local data.');
      })
      .finally(() => {
        if (!cancelled) setCatalogLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const freshen = (items) => items.map((item) => {
    const current = catalog.find((workout) => String(workout.id) === String(item.id));
    return current ? { ...current, ...item } : item;
  });

  const active = tab === 'plan' ? freshen(plan) : freshen(saved);
  const filtered = useMemo(
    () => active.filter(
      (w) =>
        w.name.toLowerCase().includes(query.toLowerCase()) ||
        w.muscleGroups.some((x) => x.toLowerCase().includes(query.toLowerCase()))
    ),
    [active, query]
  );
  const minutes = plan.reduce((a, w) => a + Number(w.duration || 0), 0);
  const calories = plan.reduce((a, w) => a + Number(w.caloriesBurned || 0), 0);

  if (!hydrated || catalogLoading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container-fit grid min-h-[65vh] place-items-center rounded-2xl border border-[#2e2e2e] bg-[#121212]">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="size-8 animate-spin rounded-full border-2 border-white/15 border-t-[var(--lime)]" />
            <div>
              <p className="display text-3xl font-bold uppercase">Loading workouts…</p>
              <p className="mt-1 text-xs text-white/40">Loading your plan and workout data.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const remove = (id) => {
    if (tab === 'plan') removePlan(id);
    else removeSaved(id);
    toast.success(tab === 'plan' ? "Removed from today's plan" : 'Removed from saved');
  };

  const done = (id) => {
    markDone(id);
    toast.success('Workout status updated');
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container-fit">
        <p className="text-xs font-bold tracking-[.25em] text-[var(--lime)]">DAILY LOG</p>
        <h1 className="display mt-2 text-6xl font-black uppercase sm:text-7xl">MY PLAN</h1>
        <p className="mt-2 max-w-xl text-sm text-white/50">Cap of five lifts for today. Finish them, then load more.</p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Exercises" value={plan.length} />
          <Stat label="Minutes" value={minutes} />
          <Stat label="Calories" value={calories} />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-b border-[#333] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex gap-6">
            <button type="button" onClick={() => setTab('plan')} className={`display border-b-2 pb-3 text-xl font-bold uppercase ${tab === 'plan' ? 'border-[var(--lime)] text-[var(--lime)]' : 'border-transparent text-white/45'}`}>
              Today's Plan
            </button>
            <button type="button" onClick={() => setTab('saved')} className={`display border-b-2 pb-3 text-xl font-bold uppercase ${tab === 'saved' ? 'border-[var(--lime)] text-[var(--lime)]' : 'border-transparent text-white/45'}`}>
              Saved
            </button>
          </div>
          <label className="flex items-center gap-2 rounded-md border border-[#444] bg-[#171717] px-3 py-2 focus-within:border-[var(--lime)]">
            <Search size={15} className="text-white/35" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search workouts..." className="w-full bg-transparent text-xs text-white outline-none sm:w-48" aria-label="Search workouts" />
          </label>
        </div>

        {catalogError && <p className="mt-4 text-xs text-yellow-300/70">{catalogError}</p>}

        <div className="mt-6 space-y-4">
          {filtered.length ? (
            filtered.map((w) => <PlanCard key={w.id} workout={w} onRemove={remove} onDone={done} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-[#3a3a3a] px-6 py-20 text-center">
              <p className="display text-4xl font-black uppercase">NOTHING HERE YET</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-white/45">Browse the library and add a lift to get today moving.</p>
              <Link href="/" className="mt-7 inline-flex items-center gap-2 rounded-md bg-[var(--lime)] px-5 py-3 text-xs font-black uppercase text-black">
                Go to workouts <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-[#333] bg-[#171717] p-5">
      <p className="text-[10px] font-bold tracking-[.2em] text-white/35">{label}</p>
      <p className="display mt-1 text-4xl font-black">{value}</p>
    </div>
  );
}
