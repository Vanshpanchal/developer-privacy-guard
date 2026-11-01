import {add,scanRegex,type Emit} from './common';
export function privateKeys(text:string,emit:Emit):void {
  scanRegex(text,/-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/g,m=>add(emit,'private-key','pem-private-key',m.index,m.index+m[0].length,'REDACT','[REDACTED_PRIVATE_KEY]',100));
}
export function hasUnclosedPrivateKey(text:string):boolean {
  const begins=(text.match(/-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/g)??[]).length;
  const ends=(text.match(/-----END (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/g)??[]).length;
  return begins!==ends;
}
