import {add,scanRegex,type Emit} from './common';
export function databaseSecrets(text:string,emit:Emit):void {
  scanRegex(text,/\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis):\/\/[^\s"'<>]{1,1000000}/gi,m=>{
    const url=m[0]; const auth=url.match(/^([a-z+]+:\/\/)([^@\/?#]+)@/i);
    if(auth){const colon=auth[2].indexOf(':'); if(colon>=0){const start=m.index+auth[1].length+colon+1;add(emit,'database','database-url-password',start,start+auth[2].length-colon-1,'REDACT','[REDACTED_PASSWORD]',85);}}
  });
  scanRegex(text,/\b(?:Password|Pwd)\s*=\s*([^;\r\n]{1,1000000})/gi,m=>{const v=m[1].trim();const start=m.index+m[0].lastIndexOf(v);add(emit,'database','connection-password',start,start+v.length,'REDACT','[REDACTED_PASSWORD]',80);});
}
