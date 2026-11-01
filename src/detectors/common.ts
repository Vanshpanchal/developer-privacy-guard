import type { Category, Detection } from '../core/Types';
export type Emit = (match: Detection) => void;
export function add(emit: Emit, category: Category, ruleId: string, start: number, end: number, action: Detection['action'], replacement: string, priority=50, tokenType?: string): void {
  emit({category,ruleId,start,end,action,replacement,priority,tokenType,confidence:priority>=80?'HIGH':priority>=40?'MEDIUM':'LOW'});
}
export function scanRegex(text:string,re:RegExp,fn:(m:RegExpExecArray)=>void):void {
  re.lastIndex=0; let m:RegExpExecArray|null;
  while ((m=re.exec(text))) { fn(m); if(m[0].length===0) re.lastIndex++; }
}
export function valueOffset(m:RegExpExecArray, value:string):number { return m.index+m[0].lastIndexOf(value); }
export function normalizeKey(key:string):string { return key.replace(/([a-z])([A-Z])/g,'$1_$2').replace(/[^a-zA-Z0-9]+/g,'_').toLowerCase(); }
