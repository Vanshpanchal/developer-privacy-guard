import {scanAsync} from '../src/core/AsyncScanner';
import {DEFAULT_SETTINGS,type Settings} from '../src/core/Types';
import {TokenMapper} from '../src/core/TokenMapper';
const settings:Settings={...DEFAULT_SETTINGS,customRules:[{id:'synthetic-org',name:'Synthetic deployment ID',category:'custom',pattern:'ACME-[0-9]{6}',policy:'TOKENIZE',enabled:true}]};
const positives:{category:string,input:string,needle:string}[]=[];
const add=(category:string,input:string,needle:string)=>positives.push({category,input,needle});
for(let i=0;i<200;i++){
  const secret=`AKIA${String(i).padStart(16,'0')}`;
  add('cloud/provider',`aws_access_key_id=${secret}`,secret);
  add('generic/auth',`apiKey: syntheticSecret${String(i).padStart(8,'0')}`,`syntheticSecret${String(i).padStart(8,'0')}`);
}
for(let i=0;i<150;i++){
  const password=`synthetic%40pw${i}`;
  add('database/config',`postgresql://alice:${password}@db.internal:5432/app`,password);
  const ip=`10.${Math.floor(i/256)}.${i%256}.7`;
  add('network/infrastructure',`backend=${ip}`,ip);
  const email=`user${i}@example.com`;
  add('personal',`contact=${email}`,email);
  const org=`ACME-${String(i).padStart(6,'0')}`;
  add('organization',`deployment=${org}`,org);
}
const negatives:string[]=[];
for(let i=0;i<250;i++)negatives.push(`INFO request ${i} succeeded at localhost:3000; api_key=placeholder; version=1.2.${i}`);
async function main():Promise<void>{
const counts=new Map<string,{tp:number,fn:number,fp:number,tn:number}>();
const bucket=(category:string)=>{let b=counts.get(category);if(!b){b={tp:0,fn:0,fp:0,tn:0};counts.set(category,b);}return b;};
for(const p of positives){const b=bucket(p.category);try{const out=(await scanAsync(p.input,'balanced',settings,new TokenMapper())).output;if(out.includes(p.needle))b.fn++;else b.tp++;}catch{b.fn++;}}
for(const input of negatives){const b=bucket('negative');try{if((await scanAsync(input,'balanced',settings,new TokenMapper())).output===input)b.tn++;else b.fp++;}catch{b.fp++;}}
const total=[...counts.values()].reduce((a,b)=>({tp:a.tp+b.tp,fn:a.fn+b.fn,fp:a.fp+b.fp,tn:a.tn+b.tn}),{tp:0,fn:0,fp:0,tn:0});
const metric=(b:{tp:number,fn:number,fp:number})=>({recall:b.tp/(b.tp+b.fn)||0,precision:b.tp/(b.tp+b.fp)||0});
console.log(JSON.stringify({sampleCount:positives.length,negativeCount:negatives.length,overall:{...total,...metric(total)},categories:Object.fromEntries([...counts].map(([k,v])=>[k,{...v,...metric(v)}]))},null,2));
const adversarial=[
 {label:'Azure connection string',input:'DefaultEndpointsProtocol=https;AccountName=demo;AccountKey=c3ludGhldGljLWF6dXJlLWtleS0xMjM0NTY=',needle:'c3ludGhldGljLWF6dXJlLWtleS0xMjM0NTY='},
 {label:'JWT in query parameter',input:'https://example.com/?jwt=eyJaaaaaaaaaaa.eyJbbbbbbbbbbb.ccccccccccccc',needle:'eyJaaaaaaaaaaa'},
 {label:'unquoted name',input:'full_name: Ada Lovelace',needle:'Ada Lovelace'},
 {label:'public IP',input:'client_ip=8.8.8.8',needle:'8.8.8.8'},
 {label:'generic secret with spaces',input:'secret = synthetic secret with spaces',needle:'synthetic secret with spaces'},
 {label:'nested JSON secret',input:'{"config":{"clientSecret":"synthetic-credential-123"}}',needle:'synthetic-credential-123'},
];
const adversarialResults=[];
for(const x of adversarial)adversarialResults.push({label:x.label,detected:!(await scanAsync(x.input,'balanced',settings,new TokenMapper())).output.includes(x.needle)});
console.log('adversarial='+JSON.stringify(adversarialResults));
}
void main();
