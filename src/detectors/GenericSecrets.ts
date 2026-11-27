import {add,isPlaceholder,scanRegex,normalizeKey,valueOffset,type Emit} from './common';
const SECRET_KEYS=/^(?:.*_)?(?:api_key|api_secret|api_token|app_secret|app_key|secret|secret_key|secret_access_key|secret_token|secret_id|client_secret|client_key|access_key|access_key_id|password|passwd|pwd|passphrase|access_token|refresh_token|auth_token|session_token|session_id|id_token|oauth_token|bearer_token|private_token|personal_access_token|bot_token|verify_token|verification_token|security_token|private_key|signing_key|signing_secret|jwt_secret|webhook_secret|encryption_key|decryption_key|master_key|hmac_key|hmac_secret|shared_secret|cookie_secret|session_secret|token_secret|smtp_password|db_password|credential|credentials|connection_password|account_key|sas_token|shared_access_signature|service_key|service_role_key|anon_key|ci_job_token|runner_token|deployment_token|csrf_token|xsrf_token|consumer_secret|oauth_secret|x_api_key|x_auth_token|x_amz_security_token|x_amz_signature|x_amz_credential|x_goog_signature|x_goog_credential)$/;
export function genericSecrets(text:string,emit:Emit):void {
  // Line bounded: JSON, YAML, TOML, env, properties and common source assignments.
  scanRegex(text,/(?<![A-Za-z0-9_.-])(?:["']?)([A-Za-z][\w.-]{1,70})(?:["']?)\s*(?::|=>|=)\s*(?:"((?:\\.|[^"\\]){1,1000000})"|'((?:\\.|[^'\\]){1,1000000})'|([^,;}\]\r\n"'{\[]{1,1000000}))/gm,m=>{
    const key=normalizeKey(m[1]); const value=(m[2]??m[3]??m[4]).trim();
    if (!SECRET_KEYS.test(key) || isPlaceholder(value)) return;
    const start=valueOffset(m,value);
    add(emit,'credential','credential-assignment',start,start+value.length,'REDACT',key.includes('password')||key==='pwd'||key==='passwd'||key==='passphrase'?'[REDACTED_PASSWORD]':'[REDACTED_SECRET]',75);
  });
  scanRegex(text,/<([A-Za-z][\w.-]{1,70})>([^<\r\n]{1,1000000})<\/\1>/g,m=>{
    const value=m[2].trim();
    if (!SECRET_KEYS.test(normalizeKey(m[1])) || isPlaceholder(value)) return;
    const start=valueOffset(m,value); add(emit,'credential','xml-secret',start,start+value.length,'REDACT','[REDACTED_SECRET]',75);
  });
}
