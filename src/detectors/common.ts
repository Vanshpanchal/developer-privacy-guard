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
export function normalizeKey(key:string):string { return key.replace(/([A-Z]+)([A-Z][a-z])/g,'$1_$2').replace(/([a-z0-9])([A-Z])/g,'$1_$2').replace(/[^a-zA-Z0-9]+/g,'_').toLowerCase(); }
const PLACEHOLDER_RE=/^(?:null|none|undefined|true|false|changeme|example|placeholder|your_.*|<.*>|\$\{.*\}|\[REDACTED_[A-Z0-9_]+\]|\[[A-Z0-9_]+_\d+\])$/i;
export function isPlaceholder(value:string):boolean { return PLACEHOLDER_RE.test(value); }
const NON_ID_PLACEHOLDER_RE=/^(?:default|unknown|n\/a|na|anonymous)$/i;
export function isIdPlaceholder(value:string):boolean { return PLACEHOLDER_RE.test(value)||NON_ID_PLACEHOLDER_RE.test(value); }
