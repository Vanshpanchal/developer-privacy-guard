import {add,isPlaceholder,scanRegex,valueOffset,type Emit} from './common';
export function webAuthentication(text:string,emit:Emit):void {
  scanRegex(text,/\b(?:Authorization\s*:\s*)?(?:Bearer|Basic)\s+([A-Za-z0-9._~+\/=:-]{8,})/gi,m=>{const start=valueOffset(m,m[1]);add(emit,'web-auth','authorization',start,start+m[1].length,'REDACT','[REDACTED_AUTH_TOKEN]',88);});
  scanRegex(text,/\b(?:Proxy-)?Authorization\s*:\s*(?:Token|ApiKey|Api-Key|Digest|OAuth|AWS)\s+([^\r\n"']+)/gi,m=>{const v=m[1].trim();if(!v)return;const start=valueOffset(m,v);add(emit,'web-auth','authorization-header',start,start+v.length,'REDACT','[REDACTED_AUTH_TOKEN]',88);});
  scanRegex(text,/\bAWS4-HMAC-SHA256\b[^\r\n]*/gi,m=>{
    const re=/\b(?:Credential|Signature)=([^,\s"']+)/gi;let p:RegExpExecArray|null;
    while((p=re.exec(m[0]))){const start=m.index+p.index+p[0].lastIndexOf(p[1]);add(emit,'cloud','aws-sigv4',start,start+p[1].length,'REDACT','[REDACTED_SECRET]',92);}
  });
  scanRegex(text,/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g,m=>add(emit,'web-auth','jwt',m.index,m.index+m[0].length,'REDACT','[REDACTED_JWT]',85));
  scanRegex(text,/[?&]((?:x-amz-signature|x-amz-security-token|x-amz-credential|awsaccesskeyid|x-goog-signature|x-goog-credential|api_?key|access_?token|refresh_?token|auth_?token|id_?token|token|secret|password|passwd|pwd|jwt|sig|signature|sas|shared_access_signature))=([^&\s"'<>#]+)/gi,m=>{
    if(isPlaceholder(m[2]))return;
    const priority=/^(?:x-amz-|x-goog-|awsaccesskeyid)/i.test(m[1])?92:84;
    const start=valueOffset(m,m[2]);add(emit,'web-auth','query-secret',start,start+m[2].length,'REDACT','[REDACTED_AUTH_TOKEN]',priority);
  });
  scanRegex(text,/\b(?:set-cookie|cookie)\s*:\s*[^\r\n]*/gi,m=>{
    const re=/(?:^|;\s*)([\w.-]*(?:session|sessid|auth|token|jwt|sid|csrf|xsrf|secret|awsalb(?:cors)?)[\w.-]*)=([^;\s"']+)/gi; let c:RegExpExecArray|null;
    while((c=re.exec(m[0]))) {const start=m.index+c.index+c[0].lastIndexOf(c[2]);add(emit,'web-auth','auth-cookie',start,start+c[2].length,'REDACT','[REDACTED_COOKIE]',82);}
  });
}
