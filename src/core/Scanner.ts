import type {Detection,Profile,ScanResult,Settings} from './Types';
import {resolve} from './MatchResolver';
import {redact} from './RedactionEngine';
import {TokenMapper} from './TokenMapper';
import {privateKeys,hasUnclosedPrivateKey} from '../detectors/PrivateKeys';
import {providerSecrets} from '../detectors/ProviderSecrets';
import {genericSecrets} from '../detectors/GenericSecrets';
import {webAuthentication} from '../detectors/WebAuthentication';
import {databaseSecrets} from '../detectors/DatabaseSecrets';
import {identifiers} from '../detectors/Identifiers';
import {customRules} from '../detectors/CustomRules';
import {cloudIdentifiers} from '../detectors/CloudIdentifiers';
import {infrastructure} from '../detectors/Infrastructure';
import {personalInformation} from '../detectors/PersonalInformation';
import {networkSecrets} from '../detectors/NetworkSecrets';
export function scan(input:string,profile:Profile,settings:Settings,mapper=new TokenMapper(),extra:Detection[]=[]):ScanResult {
  if(input.length>settings.limit || input.length>1000000) throw new Error('Input exceeds configured character limit');
  if(settings.confidentialIdentifiers.length>100||settings.protectedDomains.length>100||[...settings.confidentialIdentifiers,...settings.protectedDomains].some(v=>v.length>200))throw new Error('Too many or overly long session identifiers');
  if(hasUnclosedPrivateKey(input)) throw new Error('Incomplete private key block: output blocked');
  const start=performance.now(); const found:Detection[]=[...extra];
  const emit=(d:Detection)=>{if(settings.enabledCategories.includes(d.category)) found.push(d);};
  const format=/^\s*[\[{]/.test(input)?'JSON-like':/^\s*<\?xml|<\w+>/.test(input)?'XML-like':/^[A-Z_]+=/m.test(input)?'environment-like':'plain text';
  privateKeys(input,emit); providerSecrets(input,emit); genericSecrets(input,emit); databaseSecrets(input,emit); webAuthentication(input,emit); networkSecrets(input,emit); identifiers(input,emit,profile); cloudIdentifiers(input,emit,profile); infrastructure(input,emit,profile); personalInformation(input,emit,profile); customRules(input,emit,settings.customRules);
  for(const value of settings.confidentialIdentifiers.filter(v=>v.length>=3)) {let p=0;while((p=input.indexOf(value,p))!==-1){emit({ruleId:'confidential-identifier',category:'custom',start:p,end:p+value.length,action:'TOKENIZE',replacement:'',priority:65,tokenType:'CUSTOM',confidence:'MEDIUM'});p+=value.length;}}
  for(const domain of settings.protectedDomains.filter(v=>v.length>=3)) {let p=0;while((p=input.indexOf(domain,p))!==-1){emit({ruleId:'protected-domain',category:'network',start:p,end:p+domain.length,action:'TOKENIZE',replacement:'',priority:60,tokenType:'PRIVATE_DOMAIN',confidence:'MEDIUM'});p+=domain.length;}}
  const detections=resolve(found);
  const output=redact(input,detections,profile,mapper);
  return {output,detections:detections.map(d=>({ruleId:d.ruleId,category:d.category,start:d.start,end:d.end,confidence:d.confidence,action:d.action,replacement:d.replacement})),durationMs:performance.now()-start,profile,format,warnings:['Review output before sharing. Pattern matching cannot guarantee removal of all sensitive data.',...(profile==='credentials'?['Credentials Only leaves infrastructure and personal identifiers visible.']:[])]};
}
