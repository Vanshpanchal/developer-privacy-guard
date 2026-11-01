import {ItemView,Notice,WorkspaceLeaf} from 'obsidian';
import type PrivacyGuardPlugin from '../main';
import type {Profile,ScanResult} from '../../../src/core/Types';
import {TokenMapper} from '../../../src/core/TokenMapper';
import {scanAsync} from '../../../src/core/AsyncScanner';
import {copySanitized} from '../../../src/core/CopyPolicy';

export const VIEW_TYPE='developer-privacy-guard';

export class PrivacyGuardView extends ItemView {
  private input?:HTMLTextAreaElement;
  private output?:HTMLTextAreaElement;
  private profile?:HTMLSelectElement;
  private summary?:HTMLElement;
  private warning?:HTMLElement;
  private count?:HTMLElement;
  private identifiers?:HTMLTextAreaElement;
  private domains?:HTMLTextAreaElement;
  private sanitize?:HTMLButtonElement;
  private copy?:HTMLButtonElement;
  private mapper=new TokenMapper();
  private result?:ScanResult;
  private busy=false;
  private generation=0;

  constructor(leaf:WorkspaceLeaf,private plugin:PrivacyGuardPlugin){super(leaf);}
  getViewType():string{return VIEW_TYPE;}
  getDisplayText():string{return 'Developer Privacy Guard';}
  getIcon():string{return 'shield-check';}

  async onOpen():Promise<void>{
    const root=this.contentEl;
    root.empty();root.addClass('dpg-view');

    const header=root.createDiv({cls:'dpg-header'});
    header.createEl('h2',{cls:'dpg-title',text:'Developer Privacy Guard'});
    header.createEl('p',{text:'Sanitize pasted logs and code locally, then review before sharing.'});

    const inputSection=root.createDiv({cls:'dpg-section'});
    const inputHead=inputSection.createDiv({cls:'dpg-section-head'});
    inputHead.createEl('h3',{text:'Input'});
    this.count=inputHead.createEl('span',{cls:'dpg-count',text:'0 characters · 0 bytes'});
    this.input=inputSection.createEl('textarea',{cls:'dpg-input',attr:{'aria-label':'Raw input','placeholder':'Paste logs, configuration, or source code…','spellcheck':'false'}});
    this.input.addEventListener('input',()=>this.onInputChanged());

    const controls=root.createDiv({cls:'dpg-controls'});
    const profileLabel=controls.createEl('label',{cls:'dpg-profile'});
    profileLabel.createEl('span',{text:'Protection profile'});
    this.profile=profileLabel.createEl('select',{attr:{'aria-label':'Protection profile'}});
    for(const [value,label] of [['strict','Strict'],['balanced','Balanced'],['credentials','Credentials Only']] as const){
      const option=this.profile.createEl('option',{text:label,value});option.value=value;
    }
    this.profile.value=this.plugin.settings.defaultProfile;
    this.profile.addEventListener('change',()=>{this.invalidate();this.updateWarning();});
    this.sanitize=controls.createEl('button',{text:'Sanitize',cls:'mod-cta'});
    this.sanitize.disabled=true;
    this.sanitize.addEventListener('click',()=>void this.runScan());
    const clear=controls.createEl('button',{text:'Clear session'});
    clear.addEventListener('click',()=>this.clearSession());

    const advanced=root.createEl('details',{cls:'dpg-advanced'});
    advanced.createEl('summary',{text:'Session rules (optional)'});
    advanced.createEl('p',{text:'One value per line. These stay in memory until the panel closes.'});
    const identifiersLabel=advanced.createEl('label',{cls:'dpg-rule-label'});
    identifiersLabel.createEl('span',{text:'Confidential identifiers'});
    this.identifiers=identifiersLabel.createEl('textarea',{cls:'dpg-rule-input',attr:{'aria-label':'Confidential identifiers, one per line','placeholder':'One identifier per line','spellcheck':'false'}});
    const domainsLabel=advanced.createEl('label',{cls:'dpg-rule-label'});
    domainsLabel.createEl('span',{text:'Protected domains'});
    this.domains=domainsLabel.createEl('textarea',{cls:'dpg-rule-input',attr:{'aria-label':'Protected domains, one per line','placeholder':'One domain per line','spellcheck':'false'}});
    this.identifiers.addEventListener('input',()=>this.invalidate());
    this.domains.addEventListener('input',()=>this.invalidate());

    this.warning=root.createDiv({cls:'dpg-warning',attr:{role:'status','aria-live':'polite'}});
    this.updateWarning();

    const summarySection=root.createDiv({cls:'dpg-section'});
    summarySection.createEl('h3',{text:'Detection summary'});
    this.summary=summarySection.createDiv({cls:'dpg-summary',text:'No scan yet.'});

    const outputSection=root.createDiv({cls:'dpg-section'});
    const outputHead=outputSection.createDiv({cls:'dpg-section-head'});
    outputHead.createEl('h3',{text:'Sanitized output'});
    this.copy=outputHead.createEl('button',{text:'Copy output'});this.copy.disabled=true;
    this.copy.addEventListener('click',()=>void this.copyOutput());
    this.output=outputSection.createEl('textarea',{cls:'dpg-output',attr:{'aria-label':'Sanitized output','readonly':'true','spellcheck':'false'}});
    root.createEl('p',{cls:'dpg-footnote',text:'A completed scan cannot guarantee that all sensitive data was found.'});
  }

  private updateAvailability():void{
    if(this.sanitize&&this.input)this.sanitize.disabled=this.busy||this.input.value.length===0||this.input.value.length>this.plugin.settings.limit;
  }
  private updateWarning():void{
    if(!this.warning)return;
    if(this.input&&this.input.value.length>this.plugin.settings.limit){
      this.warning.setText(`Input exceeds the ${this.plugin.settings.limit.toLocaleString()} character limit. No output can be copied.`);
    }else if(this.profile?.value==='credentials'){
      this.warning.setText('Credentials Only leaves most personal and infrastructure identifiers visible.');
    }else this.warning.setText('');
  }
  private onInputChanged():void{
    if(!this.input||!this.count)return;
    const value=this.input.value;
    this.count.setText(`${value.length.toLocaleString()} characters · ~${new TextEncoder().encode(value).length.toLocaleString()} bytes`);
    this.invalidate();this.updateWarning();
  }
  private invalidate():void{
    this.generation++;this.result=undefined;
    if(this.output)this.output.value='';
    if(this.copy)this.copy.disabled=true;
    if(this.summary)this.summary.setText('Input changed. Sanitize again.');
    this.updateAvailability();
  }
  private async runScan():Promise<void>{
    if(this.busy||!this.input||!this.profile||!this.input.value||this.input.value.length>this.plugin.settings.limit)return;
    this.busy=true;this.invalidate();this.warning?.setText('Scanning…');
    const generation=this.generation;
    const input=this.input.value;
    const profile=this.profile.value as Profile;
    await new Promise<void>(resolve=>window.setTimeout(resolve,0));
    try{
      const settings={...this.plugin.settings,
        confidentialIdentifiers:(this.identifiers?.value??'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean),
        protectedDomains:(this.domains?.value??'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean)};
      const result=await scanAsync(input,profile,settings,this.mapper);
      if(generation!==this.generation)return;
      if(!this.plugin.settings.retainMappings)this.mapper.clear();
      this.result=result;
      if(this.output)this.output.value=result.output;
      if(this.copy)this.copy.disabled=false;
      const categories=new Map<string,number>();for(const d of result.detections)categories.set(d.category,(categories.get(d.category)??0)+1);
      this.summary?.setText(`${result.detections.length} matches · ${result.detections.filter(d=>d.action==='REDACT').length} redacted secrets · ${result.detections.filter(d=>d.action==='TOKENIZE').length} tokenized identifiers · ${result.detections.filter(d=>d.action==='REVIEW').length} review findings\n${[...categories].map(([k,v])=>`${k}: ${v}`).join(' · ')}\n${result.durationMs.toFixed(1)} ms · ${result.profile} · ${result.format}`);
      this.warning?.setText(result.warnings.join(' '));
    }catch{
      this.result=undefined;if(this.output)this.output.value='';if(this.copy)this.copy.disabled=true;
      this.warning?.setText('Scan failed or input is too large. Copy is blocked. Review custom rules and input size.');
      this.summary?.setText('Scanner error; no export available.');
    }finally{if(generation!==this.generation)this.mapper.clear();this.busy=false;this.updateAvailability();}
  }
  private async copyOutput():Promise<void>{
    if(!this.result||!this.output||!this.copy||this.copy.disabled)return;
    try{await copySanitized(this.result,text=>navigator.clipboard.writeText(text));new Notice('Sanitized output copied. Review it before sharing.');}
    catch{new Notice('Copy failed. Use the read-only output area to copy manually.');}
  }
  clearSession():void{
    this.generation++;this.mapper.clear();this.result=undefined;
    if(this.input)this.input.value='';
    if(this.identifiers)this.identifiers.value='';
    if(this.domains)this.domains.value='';
    if(this.output)this.output.value='';
    if(this.copy)this.copy.disabled=true;
    this.summary?.setText('No scan yet.');this.count?.setText('0 characters · 0 bytes');
    this.updateAvailability();this.updateWarning();
  }
  async onClose():Promise<void>{this.clearSession();this.contentEl.empty();}
}
