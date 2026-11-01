import {scanAsync} from '../src/core/AsyncScanner';
import {TokenMapper} from '../src/core/TokenMapper';
import {DEFAULT_SETTINGS,type Profile,type ScanResult} from '../src/core/Types';
import {copySanitized} from '../src/core/CopyPolicy';

const input=document.querySelector<HTMLTextAreaElement>('#input')!;
const output=document.querySelector<HTMLTextAreaElement>('#output')!;
const profile=document.querySelector<HTMLSelectElement>('#profile')!;
const identifiers=document.querySelector<HTMLTextAreaElement>('#identifiers')!;
const domains=document.querySelector<HTMLTextAreaElement>('#domains')!;
const sanitize=document.querySelector<HTMLButtonElement>('#sanitize')!;
const copy=document.querySelector<HTMLButtonElement>('#copy')!;
const clear=document.querySelector<HTMLButtonElement>('#clear')!;
const count=document.querySelector<HTMLElement>('#input-count')!;
const state=document.querySelector<HTMLElement>('#output-state')!;
const summary=document.querySelector<HTMLElement>('#summary')!;
const message=document.querySelector<HTMLElement>('#message')!;
const profileHelp=document.querySelector<HTMLElement>('#profile-help')!;

const limit=1_000_000;
const mapper=new TokenMapper();
let result:ScanResult|undefined;
let generation=0;
let busy=false;

function updateAvailability():void{
  sanitize.disabled=busy||input.value.length===0||input.value.length>limit;
  copy.disabled=!result;
}

function invalidate():void{
  generation++;
  result=undefined;
  output.value='';
  state.textContent='Awaiting scan';
  summary.textContent='Input changed. Sanitize again.';
  message.textContent=input.value.length>limit
    ?'Input exceeds the 1,000,000 character limit.'
    :profile.value==='credentials'
      ?'Credentials only leaves most personal and infrastructure identifiers visible. Review carefully.'
      :'Pattern matching cannot guarantee removal of all sensitive data. Always review the output.';
  profileHelp.textContent=profile.value==='strict'
    ?'Adds broader identifier and internal domain matching.'
    :profile.value==='credentials'
      ?'Redacts credentials; leaves most identifiers visible.'
      :'Covers common credentials and identifiers.';
  updateAvailability();
}

for(const field of [input,profile,identifiers,domains])field.addEventListener('input',()=>{
  if(field===input)count.textContent=`${input.value.length.toLocaleString()} characters`;
  invalidate();
});

sanitize.addEventListener('click',async()=>{
  if(busy||!input.value||input.value.length>limit)return;
  busy=true;
  invalidate();
  state.textContent='Scanning';
  message.textContent='Scanning locally in your browser…';
  const currentGeneration=generation;
  try{
    const settings={...DEFAULT_SETTINGS,limit,
      confidentialIdentifiers:identifiers.value.split(/\r?\n/).map(value=>value.trim()).filter(Boolean),
      protectedDomains:domains.value.split(/\r?\n/).map(value=>value.trim()).filter(Boolean)};
    const scanned=await scanAsync(input.value,profile.value as Profile,settings,mapper);
    if(currentGeneration!==generation)return;
    result=scanned;
    output.value=scanned.output;
    state.textContent='Scan complete';
    const redacted=scanned.detections.filter(d=>d.action==='REDACT').length;
    const tokenized=profile.value==='credentials'?0:scanned.detections.filter(d=>d.action==='TOKENIZE').length;
    const review=scanned.detections.filter(d=>d.action==='REVIEW').length;
    summary.textContent=`${redacted} redacted · ${tokenized} tokenized · ${review} review findings`;
    message.textContent=scanned.warnings.join(' ');
  }catch{
    if(currentGeneration===generation){
      result=undefined;
      output.value='';
      state.textContent='Scan failed';
      summary.textContent='No output available.';
      message.textContent='Scan failed. Check the input size and session rules, then try again.';
    }
  }finally{
    if(currentGeneration!==generation)mapper.clear();
    busy=false;
    updateAvailability();
  }
});

copy.addEventListener('click',async()=>{
  try{
    await copySanitized(result,text=>navigator.clipboard.writeText(text));
    message.textContent='Copied. Review the sanitized text before sharing it.';
  }catch{
    message.textContent='Clipboard access failed. Select and copy the output manually.';
  }
});

clear.addEventListener('click',()=>{
  generation++;
  mapper.clear();
  result=undefined;
  input.value='';
  output.value='';
  identifiers.value='';
  domains.value='';
  count.textContent='0 characters';
  state.textContent='Awaiting scan';
  summary.textContent='No scan yet.';
  message.textContent='Session cleared. Pattern matching cannot guarantee removal of all sensitive data.';
  updateAvailability();
});
