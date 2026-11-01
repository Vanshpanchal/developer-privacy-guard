import type {CustomRule} from '../core/Types';
import {add,scanRegex,type Emit} from './common';
export function validateRule(rule:CustomRule):string|null {
  if(!/^[a-z][a-z0-9-]{1,50}$/.test(rule.id)) return 'Invalid rule ID';
  if(rule.pattern.length>300 || !rule.pattern) return 'Pattern must be 1–300 characters';
  // A deliberately narrow regex dialect avoids user supplied backtracking traps.
  let inClass=false;
  for(let i=0;i<rule.pattern.length;i++){
    const ch=rule.pattern[i];
    if(ch==='\\'){if(/[1-9]/.test(rule.pattern[i+1]??''))return 'Backreferences are disabled';i++;continue;}
    if(ch==='['){inClass=true;continue;}
    if(ch===']'){inClass=false;continue;}
    if(inClass)continue;
    if(/[()*+?|}]/.test(ch))return 'Groups, alternation and unbounded quantifiers are disabled';
    if(ch==='{'){
      const repeat=/^\{(\d+)(?:,(\d+))?\}/.exec(rule.pattern.slice(i));
      if(!repeat||Number(repeat[2]??repeat[1])>100||Number(repeat[2]??repeat[1])<Number(repeat[1]))return 'Only bounded repeats up to 100 are allowed';
      i+=repeat[0].length-1;
    }
  }
  try {new RegExp(rule.pattern,'gu');} catch {return 'Invalid regular expression';}
  return null;
}
export function customRules(text:string,emit:Emit,rules:CustomRule[]):void {
  for(const rule of rules.filter(r=>r.enabled)) {
    const err=validateRule(rule); if(err) throw new Error(`Custom rule ${rule.id}: ${err}`);
    if(rule.keywords?.length && !rule.keywords.some(k=>text.toLowerCase().includes(k.toLowerCase()))) continue;
    scanRegex(text,new RegExp(rule.pattern,'gu'),m=>add(emit,'custom',rule.id,m.index,m.index+m[0].length,rule.policy,rule.policy==='REDACT'?'[REDACTED_CUSTOM]':'',70,'CUSTOM'));
  }
}
