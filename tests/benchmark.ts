import {scan} from '../src/core/Scanner';
import {DEFAULT_SETTINGS} from '../src/core/Types';
import {scanAsync} from '../src/core/AsyncScanner';
import {TokenMapper} from '../src/core/TokenMapper';
async function main():Promise<void>{for(const size of [10_000,100_000,1_000_000,5_000_000]){
  const line='INFO service=checkout request=ok user=a@example.com password=synthetic-value-123\n';
  const input=line.repeat(Math.ceil(size/line.length)).slice(0,size);
  const before=process.memoryUsage().heapUsed;const start=performance.now();
  try{const result=scan(input,'balanced',{...DEFAULT_SETTINGS,limit:Math.min(size,1_000_000)});console.log(JSON.stringify({bytes:size,ms:Math.round(performance.now()-start),heapDelta:process.memoryUsage().heapUsed-before,detections:result.detections.length}));
    if(size===1_000_000){let ticks=0;const timer=setInterval(()=>ticks++,1);const asyncStart=performance.now();await scanAsync(input,'balanced',{...DEFAULT_SETTINGS,limit:size},new TokenMapper());clearInterval(timer);console.log(JSON.stringify({bytes:size,asyncMs:Math.round(performance.now()-asyncStart),eventLoopTicks:ticks}));}
  }
  catch{console.log(JSON.stringify({bytes:size,blocked:true,reason:'maximum input limit'}));}
}
}
void main();
