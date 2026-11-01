import type { Detection } from './Types';
export function resolve(matches: Detection[]): Detection[] {
  const sorted = [...matches].sort((a,b) => b.priority-a.priority || (b.end-b.start)-(a.end-a.start) || a.start-b.start || a.ruleId.localeCompare(b.ruleId));
  const accepted: Detection[] = [];
  for (const m of sorted) if (m.start < m.end && !accepted.some(a => m.start < a.end && a.start < m.end)) accepted.push(m);
  return accepted.sort((a,b)=>a.start-b.start);
}
