import {App,PluginSettingTab,Setting,Notice} from 'obsidian';
import type PrivacyGuardPlugin from '../main';
import {CATEGORIES,type CustomRule,type Profile} from '../../../src/core/Types';
import {validateRule} from '../../../src/detectors/CustomRules';
export class PrivacyGuardSettingsTab extends PluginSettingTab {
  constructor(app:App,private plugin:PrivacyGuardPlugin){super(app,plugin);}
  display():void{
    const el=this.containerEl;el.empty();el.createEl('h2',{text:'Developer Privacy Guard settings'});
    new Setting(el).setName('Default profile').addDropdown(drop=>drop.addOption('balanced','Balanced').addOption('strict','Strict').addOption('credentials','Credentials Only').setValue(this.plugin.settings.defaultProfile).onChange(async v=>{this.plugin.settings.defaultProfile=v as Profile;await this.plugin.saveSettings();}));
    new Setting(el).setName('Input character limit').setDesc('100,000 by default; maximum 1,000,000.').addText(t=>t.setValue(String(this.plugin.settings.limit)).onChange(async v=>{const n=Number(v);if(Number.isInteger(n)&&n>=1000&&n<=1000000){this.plugin.settings.limit=n;await this.plugin.saveSettings();}}));
    new Setting(el).setName('Retain temporary mappings until panel closure').setDesc('When off, identifiers are consistent only within each scan.').addToggle(t=>t.setValue(this.plugin.settings.retainMappings).onChange(async v=>{this.plugin.settings.retainMappings=v;await this.plugin.saveSettings();}));
    el.createEl('h3',{text:'Detection categories'});
    for(const category of CATEGORIES)new Setting(el).setName(category).addToggle(toggle=>toggle.setValue(this.plugin.settings.enabledCategories.includes(category)).onChange(async enabled=>{this.plugin.settings.enabledCategories=enabled?[...new Set([...this.plugin.settings.enabledCategories,category])]:this.plugin.settings.enabledCategories.filter(x=>x!==category);await this.plugin.saveSettings();}));
    el.createEl('h3',{text:'Custom regex rules'});
    el.createEl('p',{text:'Enter a JSON array of rules. Rules contain patterns, never raw sensitive values. Complex regex groups and backreferences are rejected.'});
    new Setting(el).setName('Rules JSON').addTextArea(t=>t.setValue(JSON.stringify(this.plugin.settings.customRules,null,2)).onChange(async value=>{
      try{const parsed:unknown=JSON.parse(value);if(!Array.isArray(parsed)||parsed.length>50||!parsed.every(x=>typeof x==='object'&&x!==null&&typeof x.id==='string'&&typeof x.name==='string'&&typeof x.pattern==='string'&&CATEGORIES.includes(x.category)&&['REDACT','TOKENIZE','REVIEW'].includes(x.policy)&&typeof x.enabled==='boolean'&&!validateRule(x as CustomRule)))return;
        this.plugin.settings.customRules=parsed as CustomRule[];await this.plugin.saveSettings();
      }catch{/* Incomplete JSON remains in the editor until valid. */}
    }));
    new Setting(el).setName('Clear open panel session').addButton(b=>b.setButtonText('Clear').onClick(()=>{for(const leaf of this.app.workspace.getLeavesOfType('developer-privacy-guard')){const view=leaf.view;if('clearSession'in view&&typeof view.clearSession==='function')view.clearSession();}new Notice('Open panel session cleared.');}));
    el.createEl('p',{text:'Identifier mappings are held only in memory until panel closure. Raw identifiers and pasted content are never saved in settings.'});
  }
}
