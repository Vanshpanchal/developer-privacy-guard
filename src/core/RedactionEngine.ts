import type { Detection, Profile } from './Types';
import { TokenMapper } from './TokenMapper';
export function redact(input: string, detections: Detection[], profile: Profile, mapper: TokenMapper): string {
  const parts:string[]=[];
  let cursor=0;
  for(const d of detections){
    if(d.action==='REVIEW'||(d.action==='TOKENIZE'&&profile==='credentials'))continue;
    parts.push(input.slice(cursor,d.start));
    parts.push(d.action==='TOKENIZE'?mapper.token(d.tokenType??'IDENTIFIER',input.slice(d.start,d.end)):d.replacement);
    cursor=d.end;
  }
  parts.push(input.slice(cursor));
  return parts.join('');
}
