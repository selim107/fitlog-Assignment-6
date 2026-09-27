'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const PlanContext = createContext(null);
export function PlanProvider({children}) {
  const [plan,setPlan]=useState([]); const [saved,setSaved]=useState([]); const [hydrated,setHydrated]=useState(false);
  useEffect(()=>{ try{setPlan(JSON.parse(localStorage.getItem('fitlog-plan')||'[]'));setSaved(JSON.parse(localStorage.getItem('fitlog-saved')||'[]'));}catch{} setHydrated(true)},[]);
  useEffect(()=>{if(hydrated)localStorage.setItem('fitlog-plan',JSON.stringify(plan))},[plan,hydrated]);
  useEffect(()=>{if(hydrated)localStorage.setItem('fitlog-saved',JSON.stringify(saved))},[saved,hydrated]);
  const value=useMemo(()=>({plan,saved,hydrated,addPlan:(w)=>setPlan(p=>p.some(x=>x.id===w.id)?p:p.length>=5?p:[...p,{...w,done:false}]),removePlan:(id)=>setPlan(p=>p.filter(x=>x.id!==id)),markDone:(id)=>setPlan(p=>p.map(x=>x.id===id?{...x,done:!x.done}:x)),addSaved:(w)=>setSaved(p=>p.some(x=>x.id===w.id)?p:[...p,w]),removeSaved:(id)=>setSaved(p=>p.filter(x=>x.id!==id))}),[plan,saved,hydrated]);
  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}
export const usePlan=()=>useContext(PlanContext);
