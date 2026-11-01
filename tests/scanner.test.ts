import {describe,it,expect} from 'vitest';
import {scan} from '../src/core/Scanner';
import {DEFAULT_SETTINGS} from '../src/core/Types';
import {TokenMapper} from '../src/core/TokenMapper';
const settings={...DEFAULT_SETTINGS};
describe('scanner',()=>{
  it('redacts contextual credentials without touching missing values',()=>{const r=scan('API_KEY="synthetic-secret-value"\npassword=longpassword123\nempty=\napi_key=placeholder','balanced',settings);expect(r.output).not.toContain('synthetic-secret-value');expect(r.output).not.toContain('longpassword123');expect(r.output).toContain('api_key=placeholder');});
  it('redacts complete multiline key blocks',()=>{const value='-----BEGIN PRIVATE KEY-----\nSYNTHETICMATERIAL\n-----END PRIVATE KEY-----';expect(scan(value,'balanced',settings).output).toBe('[REDACTED_PRIVATE_KEY]');expect(()=>scan('-----BEGIN PRIVATE KEY-----\nSYNTHETIC','balanced',settings)).toThrow();});
  it('redacts full JWT and database passwords',()=>{const s='Authorization: Bearer eyJaaaaaaaaaaa.eyJbbbbbbbbbbb.ccccccccccccc\npostgres://user:p%40ssword@db.local:5432/app';const out=scan(s,'balanced',settings).output;expect(out).not.toContain('eyJaaaaaaaaaaa');expect(out).not.toContain('p%40ssword');expect(out).toContain(':5432/app');});
  it('uses stable tokens and clears session',()=>{const mapper=new TokenMapper();const s='contact a@example.com again a@example.com and b@example.com';const a=scan(s,'balanced',settings,mapper).output;expect(a.match(/\[USER_EMAIL_1\]/g)).toHaveLength(2);expect(a).toContain('[USER_EMAIL_2]');mapper.clear();expect(scan('b@example.com','balanced',settings,mapper).output).toContain('[USER_EMAIL_1]');});
  it('profile differences and provider tokens',()=>{const s='AWS account_id=123456789012 email a@example.com key ghp_abcdefghijklmnopqrstuvwxyz0123456789';const b=scan(s,'balanced',settings).output;const c=scan(s,'credentials',settings).output;expect(b).not.toContain('a@example.com');expect(c).toContain('a@example.com');expect(c).not.toContain('ghp_');});
  it('rejects over-limit input',()=>expect(()=>scan('x'.repeat(100001),'balanced',settings)).toThrow());
});
