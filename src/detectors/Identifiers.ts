import {add,isIdPlaceholder,scanRegex,valueOffset,type Emit} from './common';
import type {Profile} from '../core/Types';
function luhn(s:string):boolean {let sum=0,alt=false;for(let i=s.length-1;i>=0;i--){let n=+s[i];if(alt){n*=2;if(n>9)n-=9;}sum+=n;alt=!alt;}return sum%10===0;}
export function identifiers(text:string,emit:Emit,profile:Profile):void {
  if(profile==='credentials') return;
  const strict=profile==='strict';
  scanRegex(text,/\b\d{12}\b/g,m=>{if(/(?:\b(?:[a-z]+_)?account(?:_?(?:id|num|number))?\b|\b(?:owner|payer|caller|master|member)_?(?:account_?)?id\b|\baccountId\b|\bawsAccountId\b|\bownerId\b).{0,24}$/i.test(text.slice(Math.max(0,m.index-40),m.index)) || strict)add(emit,'cloud','aws-account',m.index,m.index+12,'TOKENIZE','',55,'AWS_ACCOUNT');});
  scanRegex(text,/\barn:aws(?:-[a-z0-9-]+)*:[a-z0-9-]+:[a-z0-9-]*:(?:\d{12}|aws)?(?::[^\s"'<>()\[\]{},;]+)+/gi,m=>{const val=m[0].replace(/\.+$/,'');if(val.length>8)add(emit,'cloud','aws-arn',m.index,m.index+val.length,'TOKENIZE','',68,'AWS_ARN');});
  scanRegex(text,/\bs3:\/\/([a-z0-9.-]{3,63})/gi,m=>{const start=valueOffset(m,m[1]);add(emit,'cloud','s3-bucket',start,start+m[1].length,'TOKENIZE','',55,'S3_BUCKET');});
  scanRegex(text,/(?:^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?\t|(?:START|END|REPORT)\s+RequestId:\s*)([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/gm,m=>{const start=valueOffset(m,m[1]);add(emit,'cloud','aws-lambda-request-id',start,start+m[1].length,'TOKENIZE','',68,'REQUEST_ID');});
  scanRegex(text,/\b[0-9a-f]{2}-[0-9a-f]{32}-[0-9a-f]{16}-[0-9a-f]{2}\b/gi,m=>add(emit,'infrastructure','traceparent',m.index,m.index+m[0].length,'TOKENIZE','',66,'TRACE_ID'));
  scanRegex(text,/(?<![A-Za-z0-9_.-])(?:["']?)(x-amz-request-id|x-amzn-requestid|x-amz-id-2|x-amz-cf-id|x-amz-apigw-id|x-amzn-trace-id|x-request-id|x-correlation-id|x-trace-id|x-b3-traceid|x-b3-spanid|x-cloud-trace-context|cf-ray|traceparent|(?:[a-z]+_)?(?:request|req|extended[_. -]?request|client[_. -]?request|amz[_. -]?request|cf|correlation|trace|span|parent|execution|invocation|run|job|task|transaction|tx|event|message|operation)[_. -]?id)(?:["']?)\s*(?::|=>|=)\s*["']?([A-Za-z0-9+/][A-Za-z0-9_+/=.-]{3,128})/gi,m=>{
    const val=m[2].replace(/\.+$/,'');if(isIdPlaceholder(val)||val.length<4)return;
    const start=valueOffset(m,val);
    const isTrace=/trace|span|parent/i.test(m[1]);
    add(emit,'infrastructure','request-trace-id',start,start+val.length,'TOKENIZE','',66,isTrace?'TRACE_ID':'REQUEST_ID');
  });
  scanRegex(text,/\b(?:10|127|192\.168|172\.(?:1[6-9]|2\d|3[01]))(?:\.\d{1,3}){2}\b/g,m=>{const parts=m[0].split('.').map(Number);if(parts.every(n=>n<=255)&& (strict||!m[0].startsWith('127.')))add(emit,'network','private-ip',m.index,m.index+m[0].length,'TOKENIZE','',50,'INTERNAL_IP');});
  scanRegex(text,/\b(?:fc|fd)[0-9a-f]{0,2}:[0-9a-f:]{2,39}\b/gi,m=>{try{new URL(`http://[${m[0]}]/`);add(emit,'network','private-ipv6',m.index,m.index+m[0].length,'TOKENIZE','',45,'INTERNAL_IP');}catch{/* Invalid IPv6 candidate. */}});
  scanRegex(text,/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,m=>add(emit,'personal','email',m.index,m.index+m[0].length,'TOKENIZE','',55,'USER_EMAIL'));
  scanRegex(text,/\b(?:customer|user|employee|member|order|invoice|payment|ticket|case|record|entity|device|machine|host|server|node|pod|service|endpoint|channel|webhook|database|db|table|collection|deployment|cluster)[_. -]?id\b\s*(?::|=>|=)\s*["']?([\w-]{4,80})/gi,m=>{
    if(isIdPlaceholder(m[1]))return;
    const start=valueOffset(m,m[1]);const k=m[0].toLowerCase();
    const tokenType=k.includes('deployment')?'DEPLOYMENT_ID':k.includes('cluster')?'CLUSTER_ID':'USER_ID';
    add(emit,'personal','structured-id',start,start+m[1].length,'TOKENIZE','',55,tokenType);
  });
  scanRegex(text,/(?<![A-Za-z0-9_.-])(?:["']?)(?:id|uuid|guid)(?:["']?)\s*(?::|=>|=)\s*["']?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/gi,m=>{const start=valueOffset(m,m[1]);add(emit,'personal','kv-uuid',start,start+m[1].length,'TOKENIZE','',66,'UUID');});
  if(strict)scanRegex(text,/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,m=>add(emit,'personal','uuid',m.index,m.index+m[0].length,'TOKENIZE','',66,'UUID'));
  scanRegex(text,/\b[A-Z]{5}\d{4}[A-Z]\b/g,m=>add(emit,'personal','indian-pan',m.index,m.index+m[0].length,'TOKENIZE','',50,'PAN'));
  scanRegex(text,/\b(?:\d[ -]?){13,19}\b/g,m=>{if(/[0-9a-f]-$/i.test(text.slice(Math.max(0,m.index-2),m.index)))return;const digits=m[0].replace(/\D/g,'');if(digits.length>=13&&digits.length<=19&&luhn(digits))add(emit,'personal','credit-card',m.index,m.index+m[0].length,'TOKENIZE','',65,'CARD');});
}
