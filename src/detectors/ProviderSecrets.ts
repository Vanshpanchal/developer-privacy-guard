import {add,scanRegex,type Emit} from './common';
import type {Category} from '../core/Types';
export function providerSecrets(text:string,emit:Emit):void {
  const rules:[string,RegExp,Category,string][]=[
    ['aws-access-key',/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g,'cloud','[REDACTED_AWS_ACCESS_KEY]'],
    ['github-token',/\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{36}\b|\bgithub_pat_[A-Za-z0-9_]{40,}\b/g,'git','[REDACTED_GITHUB_TOKEN]'],
    ['gitlab-token',/\bglpat-[A-Za-z0-9_-]{20,}\b/g,'git','[REDACTED_GITLAB_TOKEN]'],
    ['npm-token',/\bnpm_[A-Za-z0-9]{36}\b/g,'git','[REDACTED_NPM_TOKEN]'],
    ['stripe-key',/\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}\b/g,'third-party','[REDACTED_STRIPE_KEY]'],
    ['openai-key',/\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/g,'third-party','[REDACTED_API_KEY]'],
    ['anthropic-key',/\bsk-ant-[A-Za-z0-9_-]{20,}\b/g,'third-party','[REDACTED_API_KEY]'],
    ['slack-token',/\bxox[baprs]-[A-Za-z0-9-]{12,}\b/g,'third-party','[REDACTED_SLACK_TOKEN]'],
    ['sendgrid-key',/\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\b/g,'third-party','[REDACTED_SENDGRID_KEY]'],
    ['huggingface-token',/\bhf_[A-Za-z0-9]{30,}\b/g,'third-party','[REDACTED_API_KEY]']
  ];
  for(const [id,re,category,replacement] of rules) scanRegex(text,re,m=>add(emit,category,id,m.index,m.index+m[0].length,'REDACT',replacement,90));
}
