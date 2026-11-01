import {add,scanRegex,valueOffset,type Emit} from './common';
import type {Profile} from '../core/Types';
function luhn(s:string):boolean {let sum=0,alt=false;for(let i=s.length-1;i>=0;i--){let n=+s[i];if(alt){n*=2;if(n>9)n-=9;}sum+=n;alt=!alt;}return sum%10===0;}
export function identifiers(text:string,emit:Emit,profile:Profile):void {
  if(profile==='credentials') return;
  const strict=profile==='strict';
  scanRegex(text,/\b\d{12}\b/g,m=>{if(/\b(?:account|aws_account|account_id)\b.{0,24}$/i.test(text.slice(Math.max(0,m.index-35),m.index)) || strict)add(emit,'cloud','aws-account',m.index,m.index+12,'TOKENIZE','',55,'AWS_ACCOUNT');});
  scanRegex(text,/\barn:aws:[a-z0-9-]+:[a-z0-9-]*:\d{12}:[^\s"']+/gi,m=>add(emit,'cloud','aws-arn',m.index,m.index+m[0].length,'TOKENIZE','',60,'AWS_ARN'));
  scanRegex(text,/\bs3:\/\/([a-z0-9.-]{3,63})/gi,m=>{const start=valueOffset(m,m[1]);add(emit,'cloud','s3-bucket',start,start+m[1].length,'TOKENIZE','',55,'S3_BUCKET');});
  scanRegex(text,/\b(?:10|127|192\.168|172\.(?:1[6-9]|2\d|3[01]))(?:\.\d{1,3}){2}\b/g,m=>{const parts=m[0].split('.').map(Number);if(parts.every(n=>n<=255)&& (strict||!m[0].startsWith('127.')))add(emit,'network','private-ip',m.index,m.index+m[0].length,'TOKENIZE','',50,'INTERNAL_IP');});
  scanRegex(text,/\b(?:fc|fd)[0-9a-f]{0,2}:[0-9a-f:]{2,39}\b/gi,m=>{try{new URL(`http://[${m[0]}]/`);add(emit,'network','private-ipv6',m.index,m.index+m[0].length,'TOKENIZE','',45,'INTERNAL_IP');}catch{/* Invalid IPv6 candidate. */}});
  scanRegex(text,/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,m=>add(emit,'personal','email',m.index,m.index+m[0].length,'TOKENIZE','',55,'USER_EMAIL'));
  scanRegex(text,/\b(?:customer|user|employee|deployment|cluster)[_. -]?id\s*[:=]\s*["']?([\w-]{4,80})/gi,m=>{const start=valueOffset(m,m[1]);add(emit,'personal','structured-id',start,start+m[1].length,'TOKENIZE','',55,m[0].toLowerCase().includes('deployment')?'DEPLOYMENT_ID':'USER_ID');});
  scanRegex(text,/\b[A-Z]{5}\d{4}[A-Z]\b/g,m=>add(emit,'personal','indian-pan',m.index,m.index+m[0].length,'TOKENIZE','',50,'PAN'));
  scanRegex(text,/\b(?:\d[ -]?){13,19}\b/g,m=>{const digits=m[0].replace(/\D/g,'');if(digits.length>=13&&digits.length<=19&&luhn(digits))add(emit,'personal','credit-card',m.index,m.index+m[0].length,'TOKENIZE','',65,'CARD');});
}
