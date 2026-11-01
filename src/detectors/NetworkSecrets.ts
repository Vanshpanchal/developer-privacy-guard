import {add,scanRegex,type Emit} from './common';
export function networkSecrets(text:string,emit:Emit):void {
  scanRegex(text,/\bhttps?:\/\/[^\s"'<>]{1,1000000}/gi,m=>{
    const auth=m[0].match(/^https?:\/\/([^/?#@]+)@/i);if(!auth)return;
    const colon=auth[1].indexOf(':');if(colon<0)return;
    const start=m.index+m[0].indexOf(auth[1])+colon+1;
    add(emit,'network','url-password',start,start+auth[1].length-colon-1,'REDACT','[REDACTED_PASSWORD]',82);
  });
}
