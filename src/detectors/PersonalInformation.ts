import {add,scanRegex,valueOffset,type Emit} from './common';
import type {Profile} from '../core/Types';
function verhoeff(value:string):boolean {
  const d=[[0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],[3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],[6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],[9,8,7,6,5,4,3,2,1,0]];
  const p=[[0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],[8,9,1,6,0,4,3,5,2,7],[9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],[2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8]];
  let c=0;for(const [i,ch] of [...value].reverse().entries())c=d[c][p[i%8][Number(ch)]];return c===0;
}
export function personalInformation(text:string,emit:Emit,profile:Profile):void {
  if(profile==='credentials')return;
  scanRegex(text,/\b(?:aadhaar|aadhar)[_. -]?(?:number|id|no)?\s*[:=]\s*["']?([2-9]\d{3}[ -]?\d{4}[ -]?\d{4})\b/gi,m=>{const digits=m[1].replace(/\D/g,'');if(verhoeff(digits)){const start=valueOffset(m,m[1]);add(emit,'personal','aadhaar',start,start+m[1].length,'TOKENIZE','',70,'AADHAAR');}});
  scanRegex(text,/\b(?:phone|mobile|telephone)[_. -]?(?:number|no)?\s*[:=]\s*["']?(\+?\d[\d ()-]{7,18}\d)/gi,m=>{const digits=m[1].replace(/\D/g,'');if(digits.length>=10&&digits.length<=15){const start=valueOffset(m,m[1]);add(emit,'personal','phone',start,start+m[1].length,'TOKENIZE','',55,'PHONE');}});
  scanRegex(text,/\b(?:first_name|last_name|full_name|customer_name)\s*[:=]\s*["']([^"'\r\n]{2,80})["']/gi,m=>{const start=valueOffset(m,m[1]);add(emit,'personal','known-name',start,start+m[1].length,'TOKENIZE','',50,'PERSON_NAME');});
}
