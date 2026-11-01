import type {Detection,Profile,ScanResult,Settings} from './Types';
import {TokenMapper} from './TokenMapper';
import {scan} from './Scanner';
import {secretlintRules} from '../detectors/SecretlintRules';
export async function scanAsync(input:string,profile:Profile,settings:Settings,mapper:TokenMapper):Promise<ScanResult>{
  if(input.length>settings.limit||input.length>1000000)throw new Error('Input exceeds limit');
  if(input.length<=100000){
    const extra=await secretlintRules(input,settings.enabledCategories);
    return scan(input,profile,settings,mapper,extra);
  }
  const chunks:string[]=[];let start=0;
  while(start<input.length){
    let end=Math.min(start+64000,input.length);
    if(end<input.length){const newline=input.lastIndexOf('\n',end);if(newline<start)throw new Error('Line exceeds safe chunk size');end=newline+1;}
    chunks.push(input.slice(start,end));start=end;
  }
  const detections:ScanResult['detections']=[];const outputs:string[]=[];let durationMs=0;let offset=0;let format='plain text';const warnings=new Set<string>();
  for(const chunk of chunks){
    await new Promise<void>(resolve=>setTimeout(resolve,0));
    const extra=await secretlintRules(chunk,settings.enabledCategories);
    const r=scan(chunk,profile,settings,mapper,extra);
    if(offset===0)format=r.format;
    outputs.push(r.output);
    detections.push(...r.detections.map((d:Omit<Detection,'priority'|'tokenType'>)=>({...d,start:d.start+offset,end:d.end+offset})));
    durationMs+=r.durationMs;offset+=chunk.length;r.warnings.forEach(w=>warnings.add(w));
  }
  return {output:outputs.join(''),detections,durationMs,profile,warnings:[...warnings],format};
}
