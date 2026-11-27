import {add,isIdPlaceholder,scanRegex,valueOffset,type Emit} from './common';
import type {Profile} from '../core/Types';
export function cloudIdentifiers(text:string,emit:Emit,profile:Profile):void {
  if(profile==='credentials')return;
  scanRegex(text,/\b(?:AIDA|AROA|AGPA|AIPA|ANPA|ANVA|APKA|ASCA)[A-Z0-9]{16,17}\b/g,m=>add(emit,'cloud','aws-iam-id',m.index,m.index+m[0].length,'TOKENIZE','',65,'AWS_IAM_ID'));
  scanRegex(text,/\b(?:i|vpc|subnet|sg|eni|igw|nat|rtb|acl|vol|snap|ami|eipalloc|eipassoc|tgw|vpce|pcx|lt|fl|dopt|vgw|cgw|vpn|pl|fs|mt|aki|ari)-[0-9a-f]{8}(?:[0-9a-f]{9})?\b/g,m=>add(emit,'cloud','aws-resource-id',m.index,m.index+m[0].length,'TOKENIZE','',58,'AWS_RESOURCE_ID'));
  scanRegex(text,/\b(?:us|eu|ap|ca|sa|me|af|il|cn)-(?:east|west|north|south|central|northeast|northwest|southeast|southwest)-[1-9]_[A-Za-z0-9]{9}\b/g,m=>add(emit,'cloud','aws-cognito-pool-id',m.index,m.index+m[0].length,'TOKENIZE','',58,'AWS_RESOURCE_ID'));
  scanRegex(text,/\bRoot=1-[0-9a-f]{8}-[0-9a-f]{24}(?:;Parent=[0-9a-f]{16})?(?:;Sampled=[01])?(?:;Lineage=[0-9a-f:]+)?/gi,m=>add(emit,'cloud','aws-xray-trace-id',m.index,m.index+m[0].length,'TOKENIZE','',68,'TRACE_ID'));
  scanRegex(text,/\b1-[0-9a-f]{8}-[0-9a-f]{24}\b/g,m=>add(emit,'cloud','aws-xray-trace-id',m.index,m.index+m[0].length,'TOKENIZE','',66,'TRACE_ID'));
  scanRegex(text,/\b(\d{12})\.dkr\.ecr(?:-fips)?\.[a-z0-9-]+\.amazonaws\.com(?:\.cn)?\b/gi,m=>{const start=valueOffset(m,m[1]);add(emit,'cloud','aws-ecr-account',start,start+m[1].length,'TOKENIZE','',55,'AWS_ACCOUNT');});
  scanRegex(text,/\bsqs\.[a-z0-9-]+\.amazonaws\.com\/(\d{12})\b/gi,m=>{const start=valueOffset(m,m[1]);add(emit,'cloud','aws-sqs-account',start,start+m[1].length,'TOKENIZE','',55,'AWS_ACCOUNT');});
  scanRegex(text,/https?:\/\/([a-z0-9]{10})\.execute-api\.[a-z0-9-]+\.amazonaws\.com(?:\.cn)?\b/gi,m=>{const start=valueOffset(m,m[1]);add(emit,'cloud','aws-apigw-id',start,start+m[1].length,'TOKENIZE','',55,'AWS_RESOURCE_ID');});
  scanRegex(text,/https?:\/\/(d[a-z0-9]{10,16})\.cloudfront\.net\b/gi,m=>{const start=valueOffset(m,m[1]);add(emit,'cloud','aws-cloudfront-domain',start,start+m[1].length,'TOKENIZE','',55,'AWS_RESOURCE_ID');});
  scanRegex(text,/https?:\/\/([a-z0-9][a-z0-9.-]{1,61}[a-z0-9])\.s3(?:[.-][a-z0-9-]+)*\.amazonaws\.com(?:\.cn)?\b/gi,m=>{const start=valueOffset(m,m[1]);add(emit,'cloud','s3-bucket-url',start,start+m[1].length,'TOKENIZE','',55,'S3_BUCKET');});
  scanRegex(text,/https?:\/\/s3(?:[.-][a-z0-9-]+)*\.amazonaws\.com(?:\.cn)?\/([a-z0-9][a-z0-9.-]{1,61}[a-z0-9])(?=[/?#\s"'<>]|$)/gi,m=>{const start=valueOffset(m,m[1]);add(emit,'cloud','s3-bucket-path-url',start,start+m[1].length,'TOKENIZE','',55,'S3_BUCKET');});
  scanRegex(text,/\/subscriptions\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?:\/resourceGroups\/[^\s"'<>()\[\]{},;]+)?/gi,m=>{const val=m[0].replace(/\.+$/,'');add(emit,'cloud','azure-resource-id',m.index,m.index+val.length,'TOKENIZE','',60,'AZURE_RESOURCE');});
  scanRegex(text,/\bprojects\/[a-z][a-z0-9-]{4,30}\/(?:locations|regions|zones|topics|subscriptions|secrets|serviceAccounts|buckets|databases|instances|clusters|jobs|datasets|repositories|keys)\/[^\s"'<>()\[\]{},;]+/g,m=>{const val=m[0].replace(/\.+$/,'');add(emit,'cloud','gcp-resource-path',m.index,m.index+val.length,'TOKENIZE','',60,'GCP_RESOURCE');});
  scanRegex(text,/\b(?:(?:[a-z]+_)?(?:account|subscription|tenant|project|organization|org|workspace|folder|billing_account|environment|env|distribution|hosted_zone|kms_key|key|vault|bucket|queue|topic|stream|client|app|application|principal|role|policy|identity|instance|vpc|subnet|security_group|sg|installation)[_. -]?id|resource_group(?:_name)?)\b\s*(?::|=>|=)\s*["']?([A-Za-z0-9][A-Za-z0-9._:/-]{3,80})/gi,m=>{
    const val=m[1].replace(/\.+$/,'');if(isIdPlaceholder(val)||val.length<4)return;
    const start=valueOffset(m,val);add(emit,'cloud','cloud-project-id',start,start+val.length,'TOKENIZE','',53,'CLOUD_ID');
  });
  scanRegex(text,/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.iam\.gserviceaccount\.com\b/g,m=>add(emit,'cloud','gcp-service-account',m.index,m.index+m[0].length,'TOKENIZE','',65,'SERVICE_ACCOUNT'));
  if(profile==='strict')scanRegex(text,/\b(?:[a-z0-9-]+\.)+(?:internal|corp|local)\b/gi,m=>{if(m[0]!=='localhost')add(emit,'network','internal-domain',m.index,m.index+m[0].length,'TOKENIZE','',50,'INTERNAL_HOST');});
}
