import {beforeEach,expect,it,vi} from 'vitest';
import {existsSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

type Handler=()=>void|Promise<void>;
class Field {
  value='';
  textContent='';
  disabled=false;
  private handlers=new Map<string,Handler>();
  addEventListener(event:string,handler:Handler):void{this.handlers.set(event,handler);}
  async trigger(event:string):Promise<void>{await this.handlers.get(event)?.();}
}

beforeEach(()=>{vi.resetModules();vi.unstubAllGlobals();});

it('uses relative local assets for GitHub Pages project URLs',()=>{
  const page=new URL('../web/index.html',import.meta.url);
  const html=readFileSync(page,'utf8');
  const assets=[...html.matchAll(/(?:src|href)="(\.\/[^\"]+)"/g)].map(match=>match[1]);
  expect(assets).toEqual(expect.arrayContaining(['./app.js','./styles.css','./favicon.svg']));
  for(const asset of assets)expect(existsSync(fileURLToPath(new URL(asset,page)))).toBe(true);
  expect(existsSync(fileURLToPath(new URL('../web/.nojekyll',import.meta.url)))).toBe(true);
});

it('publishes a browser bundle without storage or upload APIs',()=>{
  const bundle=readFileSync(new URL('../web/app.js',import.meta.url),'utf8');
  expect(bundle).not.toMatch(/localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|WebSocket|sendBeacon|serviceWorker/);
});

it('sanitizes in memory, copies only the result, and clears the session',async()=>{
  const ids=['input','output','profile','identifiers','domains','sanitize','copy','clear','input-count','output-state','summary','message','profile-help'];
  const fields=Object.fromEntries(ids.map(id=>[id,new Field()])) as Record<string,Field>;
  fields.profile.value='balanced';
  vi.stubGlobal('document',{querySelector:(selector:string)=>fields[selector.slice(1)]});
  const writeText=vi.fn(async(_text:string)=>{});
  vi.stubGlobal('navigator',{clipboard:{writeText}});
  await import('../web/main');

  fields.input.value='password=synthetic-secret-value';
  await fields.input.trigger('input');
  expect(fields.sanitize.disabled).toBe(false);
  await fields.sanitize.trigger('click');
  expect(fields.output.value).toBe('password=[REDACTED_PASSWORD]');
  expect(fields.copy.disabled).toBe(false);
  await fields.copy.trigger('click');
  expect(writeText).toHaveBeenCalledWith(fields.output.value);

  await fields.clear.trigger('click');
  expect(fields.input.value).toBe('');
  expect(fields.output.value).toBe('');
  expect(fields.copy.disabled).toBe(true);
});
