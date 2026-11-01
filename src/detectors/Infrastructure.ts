import {add,scanRegex,valueOffset,type Emit} from './common';
import type {Profile} from '../core/Types';
export function infrastructure(text:string,emit:Emit,profile:Profile):void {
  scanRegex(text,/\b(?:dockerconfigjson|\.dockerconfigjson)\s*[:=]\s*["']?([A-Za-z0-9+/=]{20,})/gi,m=>{const start=valueOffset(m,m[1]);add(emit,'infrastructure','docker-auth',start,start+m[1].length,'REDACT','[REDACTED_DOCKER_AUTH]',85);});
  scanRegex(text,/\b(?:data\s*:\s*\n\s*)?(?:token|password|clientSecret)\s*:\s*([A-Za-z0-9+/=]{20,})/gi,m=>{if(!/\b(?:kind\s*:\s*Secret|docker|kubernetes)/i.test(text.slice(Math.max(0,m.index-200),m.index)))return;const start=valueOffset(m,m[1]);add(emit,'infrastructure','k8s-secret',start,start+m[1].length,'REDACT','[REDACTED_SECRET]',82);});
  if(profile!=='credentials')scanRegex(text,/\b(?:deployment|cluster)[_. -]?(?:name|id)\s*[:=]\s*["']?([a-z0-9][a-z0-9._-]{3,80})/gi,m=>{const start=valueOffset(m,m[1]);add(emit,'infrastructure','infra-id',start,start+m[1].length,'TOKENIZE','',55,m[0].toLowerCase().includes('cluster')?'CLUSTER_ID':'DEPLOYMENT_ID');});
}
