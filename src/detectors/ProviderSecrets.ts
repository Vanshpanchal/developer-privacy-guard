import {add,scanRegex,type Emit} from './common';
import type {Category} from '../core/Types';
export function providerSecrets(text:string,emit:Emit):void {
  const rules:[string,RegExp,Category,string][]=[
    ['aws-access-key',/\b(?:AKIA|ASIA|ABIA|ACCA)[A-Z0-9]{16}\b/g,'cloud','[REDACTED_AWS_ACCESS_KEY]'],
    ['gcp-api-key',/\bAIza[0-9A-Za-z_-]{35}\b/g,'cloud','[REDACTED_API_KEY]'],
    ['google-oauth-token',/\bya29\.[0-9A-Za-z_-]{20,}\b/g,'web-auth','[REDACTED_OAUTH_TOKEN]'],
    ['digitalocean-token',/\bdo[opr]_v1_[a-f0-9]{64}\b/g,'cloud','[REDACTED_CLOUD_TOKEN]'],
    ['github-token',/\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{36}\b|\bgithub_pat_[A-Za-z0-9_]{40,}\b/g,'git','[REDACTED_GITHUB_TOKEN]'],
    ['gitlab-token',/\bgl(?:pat|rt|dt|ptt|oas)-[A-Za-z0-9_-]{20,}\b/g,'git','[REDACTED_GITLAB_TOKEN]'],
    ['npm-token',/\bnpm_[A-Za-z0-9]{36}\b/g,'git','[REDACTED_NPM_TOKEN]'],
    ['pypi-token',/\bpypi-AgEIcHlwaS5vcmc[A-Za-z0-9_-]{30,}\b/g,'git','[REDACTED_PYPI_TOKEN]'],
    ['docker-pat',/\bdckr_pat_[A-Za-z0-9_-]{20,}\b/g,'infrastructure','[REDACTED_DOCKER_TOKEN]'],
    ['vault-token',/\bhvs\.[A-Za-z0-9_-]{20,}\b/g,'infrastructure','[REDACTED_VAULT_TOKEN]'],
    ['stripe-key',/\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}\b/g,'third-party','[REDACTED_STRIPE_KEY]'],
    ['stripe-webhook-secret',/\bwhsec_[A-Za-z0-9]{24,}\b/g,'third-party','[REDACTED_STRIPE_KEY]'],
    ['openai-key',/\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/g,'third-party','[REDACTED_API_KEY]'],
    ['anthropic-key',/\bsk-ant-[A-Za-z0-9_-]{20,}\b/g,'third-party','[REDACTED_API_KEY]'],
    ['slack-token',/\bxox[baprs]-[A-Za-z0-9-]{12,}\b/g,'third-party','[REDACTED_SLACK_TOKEN]'],
    ['slack-webhook',/https:\/\/hooks\.slack\.com\/services\/T[A-Z0-9]{8,}\/B[A-Z0-9]{8,}\/[A-Za-z0-9]{20,}/g,'third-party','[REDACTED_SLACK_WEBHOOK]'],
    ['sendgrid-key',/\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\b/g,'third-party','[REDACTED_SENDGRID_KEY]'],
    ['huggingface-token',/\bhf_[A-Za-z0-9]{30,}\b/g,'third-party','[REDACTED_API_KEY]'],
    ['databricks-token',/\bdapi[0-9a-f]{32}(?:-\d)?\b/g,'third-party','[REDACTED_API_KEY]'],
    ['shopify-token',/\bshp(?:at|ca|pa|ss)_[a-fA-F0-9]{32}\b/g,'third-party','[REDACTED_SHOPIFY_TOKEN]'],
    ['postman-key',/\bPMAK-[A-Za-z0-9]{24}-[A-Za-z0-9]{34}\b/g,'third-party','[REDACTED_API_KEY]'],
    ['linear-key',/\blin_api_[A-Za-z0-9]{30,}\b/g,'third-party','[REDACTED_API_KEY]'],
    ['groq-key',/\bgsk_[A-Za-z0-9]{40,}\b/g,'third-party','[REDACTED_API_KEY]'],
    ['perplexity-key',/\bpplx-[A-Za-z0-9]{40,}\b/g,'third-party','[REDACTED_API_KEY]'],
    ['replicate-token',/\br8_[A-Za-z0-9]{30,}\b/g,'third-party','[REDACTED_API_KEY]'],
    ['xai-key',/\bxai-[A-Za-z0-9]{40,}\b/g,'third-party','[REDACTED_API_KEY]']
  ];
  for(const [id,re,category,replacement] of rules) scanRegex(text,re,m=>add(emit,category,id,m.index,m.index+m[0].length,'REDACT',replacement,90));
}
