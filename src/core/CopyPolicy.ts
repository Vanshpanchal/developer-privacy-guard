import type {ScanResult} from './Types';
export async function copySanitized(result:ScanResult|undefined,write:(text:string)=>Promise<void>):Promise<void>{
  if(!result)throw new Error('No successful scan is available to copy');
  await write(result.output);
}
