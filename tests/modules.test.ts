import {it,expect} from 'vitest';
import {scan} from '../src/core/Scanner';
import {DEFAULT_SETTINGS} from '../src/core/Types';
import {validateRule} from '../src/detectors/CustomRules';
const s={...DEFAULT_SETTINGS};
it.each([
 ['cloud','AKIA0000000000000000'],
 ['git','ghp_abcdefghijklmnopqrstuvwxyz0123456789'],
 ['database','postgres://bob:p%40ss@db.local:5432/app'],
 ['web-auth','Authorization: Basic c3ludGhldGljOnNlY3JldA=='],
 ['third-party','sk_test_1234567890abcdefghijkl'],
 ['private-key','-----BEGIN OPENSSH PRIVATE KEY-----\nSYNTHETIC\n-----END OPENSSH PRIVATE KEY-----'],
 ['network','http://bob:syntheticpw@internal.local/path'],
 ['personal','user@example.com'],
 ['infrastructure','kind: Secret\ndata:\n token: c3ludGhldGljLXNlY3JldC0xMjM0NQ=='],
 ['framework','DATABASE_PASSWORD: syntheticonly123'],
] as const)('%s detection changes sensitive input',(_name,input)=>expect(scan(input,'balanced',s).output).not.toBe(input));
it('custom rules tokenize without persisting matched values',()=>{const r=scan('ACME-123456', 'balanced',{...s,customRules:[{id:'org-id',name:'Org ID',category:'custom',pattern:'ACME-[0-9]{6}',policy:'TOKENIZE',enabled:true}]});expect(r.output).toBe('[CUSTOM_1]');expect(JSON.stringify(r.detections)).not.toContain('ACME-123456');});
it('rejects unsafe custom expressions',()=>{expect(validateRule({id:'bad',name:'bad',category:'custom',pattern:'(a+)+',policy:'REDACT',enabled:true})).toBeTruthy();});
it('handles unicode and ANSI without losing formatting',()=>{const input='\u001b[31m错误\u001b[0m api_key=synthetic123\n';const out=scan(input,'balanced',s).output;expect(out).toContain('错误');expect(out).toContain('\u001b[31m');expect(out).not.toContain('synthetic123');});
it('redacts long values entirely',()=>{const v='X'.repeat(20000);const out=scan(`password=${v}`,'balanced',s).output;expect(out).not.toContain('XXXX');});
it('redacts nested JSON and Azure account keys',()=>{
 const input='{"config":{"clientSecret":"synthetic-credential-123"}}\nAccountKey=c3ludGhldGljLWF6dXJlLWtleS0xMjM0NTY=';
 const out=scan(input,'balanced',s).output;
 expect(out).not.toContain('synthetic-credential-123');
 expect(out).not.toContain('c3ludGhldGljLWF6dXJlLWtleS0xMjM0NTY=');
});
it('applies session-only confidential identifiers and protected domains',()=>{
 const input='deploy ACME-PRIVATE to api.corp.example';
 const out=scan(input,'balanced',{...s,confidentialIdentifiers:['ACME-PRIVATE'],protectedDomains:['corp.example']}).output;
 expect(out).not.toContain('ACME-PRIVATE');expect(out).not.toContain('corp.example');
});
it('redacts complete escaped JSON string values',()=>{
 const input='{"password":"synthetic\\\"secret\\\"tail"}';
 const out=scan(input,'balanced',s).output;
 expect(out).not.toContain('tail');
 expect(out).not.toContain('synthetic');
});
it('rejects unbounded brace repeats',()=>{
 expect(validateRule({id:'bad2',name:'bad',category:'custom',pattern:'a{1,}',policy:'REDACT',enabled:true})).toBeTruthy();
});
it('validates IPv4 and IPv6 candidates',()=>{
 expect(scan('ip=10.1.2.3 ipv6=fd00::1','balanced',s).output).not.toContain('10.1.2.3');
 expect(scan('ip=10.1.2.3 ipv6=fd00::1','balanced',s).output).not.toContain('fd00::1');
 expect(scan('ip=10.999.2.3 ipv6=fd00::::1','balanced',s).output).toContain('10.999.2.3');
});
it('whole private key wins overlapping nested matches',()=>{
 const input='-----BEGIN PRIVATE KEY-----\npassword=synthetic-123\n-----END PRIVATE KEY-----';
 const r=scan(input,'balanced',s);
 expect(r.output).toBe('[REDACTED_PRIVATE_KEY]');
 expect(r.detections).toHaveLength(1);
});
it('fails closed on invalid custom rule at scan time',()=>{
 expect(()=>scan('harmless','balanced',{...s,customRules:[{id:'bad',name:'bad',category:'custom',pattern:'(a+)+',policy:'REDACT',enabled:true}]})).toThrow();
});
