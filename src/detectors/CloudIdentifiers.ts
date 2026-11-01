import {add,scanRegex,valueOffset,type Emit} from './common';
import type {Profile} from '../core/Types';
export function cloudIdentifiers(text:string,emit:Emit,profile:Profile):void {
  if(profile==='credentials')return;
  scanRegex(text,/\b(?:subscription|tenant|project)[_. -]?id\s*[:=]\s*["']?([a-f0-9-]{20,80})/gi,m=>{const start=valueOffset(m,m[1]);add(emit,'cloud','cloud-project-id',start,start+m[1].length,'TOKENIZE','',55,'CLOUD_ID');});
  scanRegex(text,/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.iam\.gserviceaccount\.com\b/g,m=>add(emit,'cloud','gcp-service-account',m.index,m.index+m[0].length,'TOKENIZE','',65,'SERVICE_ACCOUNT'));
  if(profile==='strict')scanRegex(text,/\b(?:[a-z0-9-]+\.)+(?:internal|corp|local)\b/gi,m=>{if(m[0]!=='localhost')add(emit,'network','internal-domain',m.index,m.index+m[0].length,'TOKENIZE','',50,'INTERNAL_HOST');});
}
