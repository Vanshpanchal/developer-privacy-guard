import {lintSource} from '@secretlint/core';
import {creator as awsRule} from '@secretlint/secretlint-rule-aws';
import {creator as githubRule} from '@secretlint/secretlint-rule-github';
import {creator as gitlabRule} from '@secretlint/secretlint-rule-gitlab';
import {creator as openaiRule} from '@secretlint/secretlint-rule-openai';
import {creator as anthropicRule} from '@secretlint/secretlint-rule-anthropic';
import {creator as stripeRule} from '@secretlint/secretlint-rule-stripe';
import type {Category,Detection} from '../core/Types';
/** Only individual rules verified in the Obsidian browser-targeted bundle. */
export async function secretlintRules(text:string,enabled:Category[]):Promise<Detection[]>{
  const candidates=[
    {id:'@secretlint/secretlint-rule-aws',rule:awsRule,category:'cloud' as Category},
    {id:'@secretlint/secretlint-rule-github',rule:githubRule,category:'git' as Category},
    {id:'@secretlint/secretlint-rule-gitlab',rule:gitlabRule,category:'git' as Category},
    {id:'@secretlint/secretlint-rule-openai',rule:openaiRule,category:'third-party' as Category},
    {id:'@secretlint/secretlint-rule-anthropic',rule:anthropicRule,category:'third-party' as Category},
    {id:'@secretlint/secretlint-rule-stripe',rule:stripeRule,category:'third-party' as Category}
  ];
  const active=candidates.filter(x=>enabled.includes(x.category));
  if(active.length===0)return [];
  const result=await lintSource({
    source:{content:text,filePath:'pasted.txt',contentType:'text'},
    options:{noPhysicFilePath:true,maskSecrets:true,config:{rules:active.map(({id,rule})=>({id,rule}))}}
  });
  return result.messages.map(m=>{
    const category=candidates.find(x=>x.id===m.ruleId)?.category??'credential';
    return {ruleId:m.ruleId,category,start:m.range[0],end:m.range[1],confidence:'HIGH',action:'REDACT',replacement:'[REDACTED_SECRET]',priority:95};
  });
}
