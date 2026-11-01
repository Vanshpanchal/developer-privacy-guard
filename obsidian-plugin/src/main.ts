import {Plugin} from 'obsidian';
import {DEFAULT_SETTINGS,type Settings} from '../../src/core/Types';
import {PrivacyGuardView,VIEW_TYPE} from './ui/PrivacyGuardView';
import {PrivacyGuardSettingsTab} from './ui/SettingsTab';
export default class PrivacyGuardPlugin extends Plugin {
  settings:Settings={...DEFAULT_SETTINGS};
  async onload():Promise<void>{
    const loaded=await this.loadData() as Partial<Settings>|null;
    this.settings={...DEFAULT_SETTINGS,...loaded,confidentialIdentifiers:[],protectedDomains:[]};
    this.registerView(VIEW_TYPE,leaf=>new PrivacyGuardView(leaf,this));
    this.addRibbonIcon('shield-check','Open Developer Privacy Guard',()=>void this.openView());
    this.addCommand({id:'open-privacy-guard',name:'Open Developer Privacy Guard',callback:()=>void this.openView()});
    this.addSettingTab(new PrivacyGuardSettingsTab(this.app,this));
  }
  async openView():Promise<void>{
    const leaf=this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]??this.app.workspace.getRightLeaf(false);
    if(!leaf)return;
    await leaf.setViewState({type:VIEW_TYPE,active:true});
    this.app.workspace.revealLeaf(leaf);
  }
  async saveSettings():Promise<void>{
    const {confidentialIdentifiers:_identifiers,protectedDomains:_domains,...safe}=this.settings;
    await this.saveData(safe);
  }
  onunload():void{this.app.workspace.detachLeavesOfType(VIEW_TYPE);}
}
