import {it,expect} from 'vitest';
import {scanAsync} from '../src/core/AsyncScanner';
import {DEFAULT_SETTINGS} from '../src/core/Types';
import {TokenMapper} from '../src/core/TokenMapper';
it('scans large input in bounded chunks while preserving repeated tokens',async()=>{
 const input='contact=a@example.com\n'.repeat(6000);
 const result=await scanAsync(input,'balanced',{...DEFAULT_SETTINGS,limit:1000000},new TokenMapper());
 expect(result.output).not.toContain('a@example.com');
 expect(result.output.match(/\[USER_EMAIL_1\]/g)).toHaveLength(6000);
});
it('blocks a long unsplittable line',async()=>{
 await expect(scanAsync('password='+'x'.repeat(100000),'balanced',{...DEFAULT_SETTINGS,limit:1000000},new TokenMapper())).rejects.toThrow();
});
it('runs bundled Secretlint GitHub rule without exposing message text',async()=>{
 const token='ghp_'+'a'.repeat(36);
 const result=await scanAsync(`token=${token}`,'balanced',DEFAULT_SETTINGS,new TokenMapper());
 expect(result.detections.some(d=>d.ruleId==='@secretlint/secretlint-rule-github')).toBe(true);
 expect(JSON.stringify(result.detections)).not.toContain(token);
 expect(result.output).not.toContain(token);
});
