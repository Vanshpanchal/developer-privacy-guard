import {add,scanRegex,normalizeKey,valueOffset,type Emit} from './common';
const SECRET_KEYS=/^(?:.*_)?(?:api_key|secret|secret_key|client_secret|password|passwd|pwd|access_token|refresh_token|auth_token|session_token|private_key|signing_key|jwt_secret|smtp_password|db_password|credential|credentials|connection_password|account_key|ci_job_token|runner_token|deployment_token)$/;
export function genericSecrets(text:string,emit:Emit):void {
  // Line bounded: JSON, YAML, TOML, env, properties and common source assignments.
  scanRegex(text,/(?<![A-Za-z0-9_.-])(?:["']?)([A-Za-z][\w.-]{1,70})(?:["']?)\s*(?::|=>|=)\s*(?:"((?:\\.|[^"\\]){1,1000000})"|'((?:\\.|[^'\\]){1,1000000})'|([^,;}\]\r\n"'{\[]{1,1000000}))/gm,m=>{
    const key=normalizeKey(m[1]); const value=(m[2]??m[3]??m[4]).trim();
    if (!SECRET_KEYS.test(key) || /^(?:null|none|undefined|true|false|changeme|example|placeholder|your_.*|<.*>|\$\{.*\})$/i.test(value)) return;
    const start=valueOffset(m,value);
    add(emit,'credential','credential-assignment',start,start+value.length,'REDACT',key.includes('password')||key==='pwd'||key==='passwd'?'[REDACTED_PASSWORD]':'[REDACTED_SECRET]',75);
  });
  scanRegex(text,/<([A-Za-z][\w.-]{1,70})>([^<\r\n]{1,1000000})<\/\1>/g,m=>{
    if (!SECRET_KEYS.test(normalizeKey(m[1]))) return;
    const start=valueOffset(m,m[2]); add(emit,'credential','xml-secret',start,start+m[2].length,'REDACT','[REDACTED_SECRET]',75);
  });
}
