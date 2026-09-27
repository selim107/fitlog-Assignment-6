'use client';

import Link from 'next/link';
import { Dumbbell, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { usePlan } from '@/context/PlanContext';

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { plan, saved } = usePlan();

  const workoutActive = path === '/' || path.startsWith('/workout/');
  const planActive = path === '/my-plan';
  const nav = [
    ['Workout', '/', workoutActive],
    ['My Plan', '/my-plan', planActive],
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#303030] bg-[#101010]/95 backdrop-blur-md">
      <div className="container-fit flex min-h-[72px] items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="FitLog home">
          <span className="grid size-9 place-items-center rounded-md bg-[var(--lime)] text-black shadow-[0_0_22px_rgba(204,255,0,.12)]">
            <Dumbbell size={19} strokeWidth={2.5} />
          </span>
          <span className="display text-2xl font-black tracking-[.04em]">FITLOG</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {nav.map(([label, href, active]) => (
            <Link
              key={href}
              href={href}
              className={`display relative px-1 py-2 text-lg font-bold uppercase tracking-wide transition ${
                active ? 'text-[var(--lime)]' : 'text-white/55 hover:text-white'
              }`}
            >
              {label}
              {active && <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-[var(--lime)]" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/my-plan"
            className="rounded-full bg-[var(--lime)] px-3.5 py-2 text-[10px] font-black uppercase tracking-wide text-black sm:px-4"
          >
            Plan <span className="ml-1 tabular-nums">{plan.length}</span>
          </Link>
          <Link
            href="/my-plan"
            className="rounded-full border border-[#6a6a6a] px-3.5 py-2 text-[10px] font-black uppercase tracking-wide text-white sm:px-4"
          >
            Saved <span className="ml-1 tabular-nums">{saved.length}</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="ml-1 grid size-10 place-items-center rounded-md border border-[#444] text-white md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-[#303030] bg-[#101010] px-5 py-4 md:hidden" aria-label="Mobile navigation">
          <div className="container-fit flex flex-col gap-1">
            {nav.map(([label, href, active]) => (
              <Link
                onClick={() => setOpen(false)}
                key={href}
                href={href}
                className={`display border-b border-[#262626] px-1 py-4 text-xl uppercase ${
                  active ? 'text-[var(--lime)]' : 'text-white/75'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
