import {add,scanRegex,valueOffset,type Emit} from './common';
export function webAuthentication(text:string,emit:Emit):void {
  scanRegex(text,/\b(?:Authorization\s*:\s*)?(?:Bearer|Basic)\s+([A-Za-z0-9._~+\/=:-]{8,})/gi,m=>{const start=valueOffset(m,m[1]);add(emit,'web-auth','authorization',start,start+m[1].length,'REDACT','[REDACTED_AUTH_TOKEN]',88);});
  scanRegex(text,/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g,m=>add(emit,'web-auth','jwt',m.index,m.index+m[0].length,'REDACT','[REDACTED_JWT]',85));
  scanRegex(text,/\b(?:set-cookie|cookie)\s*:\s*[^\r\n]*/gi,m=>{
    const re=/(?:^|;\s*)([\w-]*(?:session|auth|token|jwt)[\w-]*)=([^;\s]+)/gi; let c:RegExpExecArray|null;
    while((c=re.exec(m[0]))) {const start=m.index+c.index+c[0].lastIndexOf(c[2]);add(emit,'web-auth','auth-cookie',start,start+c[2].length,'REDACT','[REDACTED_COOKIE]',82);}
  });
}
