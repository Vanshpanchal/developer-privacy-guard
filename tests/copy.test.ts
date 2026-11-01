import {it,expect,vi} from 'vitest';
import {copySanitized} from '../src/core/CopyPolicy';
import {scan} from '../src/core/Scanner';
import {DEFAULT_SETTINGS} from '../src/core/Types';
it('copies only a successful sanitized result',async()=>{
 const write=vi.fn(async(_text:string)=>{});
 await expect(copySanitized(undefined,write)).rejects.toThrow();expect(write).not.toHaveBeenCalled();
 const result=scan('password=synthetic-123','balanced',DEFAULT_SETTINGS);
 await copySanitized(result,write);
 expect(write).toHaveBeenCalledWith('password=[REDACTED_PASSWORD]');
});
