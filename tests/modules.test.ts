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

it('redacts AWS secrets, SigV4 headers, and presigned URL parameters across profiles',()=>{
 const input=[
  'AWS_ACCESS_KEY_ID=AKIA0000000000000001',
  'AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYsynthetic',
  'AWS_SESSION_TOKEN=FwoGZXIvYXdzESyntheticSessionToken123',
  '{"awsAccessKeyId":"ASIA0000000000000002","secretAccessKey":"syntheticSecretAccessKeyValue","session_id":"sess_synthetic_987654"}',
  'Authorization: AWS4-HMAC-SHA256 Credential=AKIA0000000000000003/20261127/us-east-1/s3/aws4_request, SignedHeaders=host, Signature=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  'https://demo-bucket.s3.us-east-1.amazonaws.com/key.txt?X-Amz-Credential=AKIA0000000000000004%2F20261127%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Security-Token=syntheticTokenValue&X-Amz-Signature=abcdef0123456789abcdef0123456789'
 ].join('\n');
 for(const profile of ['balanced','credentials'] as const){
  const out=scan(input,profile,s).output;
  expect(out).not.toContain('AKIA0000000000000001');
  expect(out).not.toContain('ASIA0000000000000002');
  expect(out).not.toContain('AKIA0000000000000003');
  expect(out).not.toContain('AKIA0000000000000004');
  expect(out).not.toContain('wJalrXUtnFEMI');
  expect(out).not.toContain('FwoGZXIvYXdzE');
  expect(out).not.toContain('syntheticSecretAccessKeyValue');
  expect(out).not.toContain('sess_synthetic_987654');
  expect(out).not.toContain('0123456789abcdef0123456789abcdef');
  expect(out).not.toContain('syntheticTokenValue');
  expect(out).not.toContain('abcdef0123456789');
 }
});
it('tokenizes AWS ARNs, account IDs, IAM IDs, and resource IDs',()=>{
 const input=[
  'arn=arn:aws:s3:::my-private-bucket/path/file.json,',
  'policy=arn:aws:iam::aws:policy/ReadOnlyAccess',
  'gov=arn:aws-us-gov:sts::123456789012:assumed-role/Admin/session-1.',
  'cn=arn:aws-cn:lambda:cn-north-1:123456789012:function:fn:$LATEST',
  '{"accountId":"210987654321","iam":"AIDAJQABLZS4A3QDU576Q","role":"AROA1234567890EXAMPLE"}',
  'vpc=vpc-0a1b2c3d4e5f67890 subnet=subnet-0123456789abcdef0 sg=sg-0fedcba9876543210 ec2=i-0123456789abcdef0',
  'ecr=210987654321.dkr.ecr.us-east-1.amazonaws.com/repo sqs=https://sqs.us-east-1.amazonaws.com/210987654321/q',
  's3=https://demo-logs-bucket.s3.us-west-2.amazonaws.com/a.log apigw=https://abc123def4.execute-api.us-east-1.amazonaws.com/prod',
  'cf=https://d111111abcdef8.cloudfront.net cognito=us-east-1_AbCdEf123'
 ].join('\n');
 const out=scan(input,'balanced',s).output;
 expect(out).not.toContain('my-private-bucket');
 expect(out).not.toContain('ReadOnlyAccess');
 expect(out).not.toContain('123456789012');
 expect(out).not.toContain('210987654321');
 expect(out).not.toContain('AIDAJQABLZS4A3QDU576Q');
 expect(out).not.toContain('AROA1234567890EXAMPLE');
 expect(out).not.toContain('vpc-0a1b2c3d4e5f67890');
 expect(out).not.toContain('subnet-0123456789abcdef0');
 expect(out).not.toContain('sg-0fedcba9876543210');
 expect(out).not.toContain('i-0123456789abcdef0');
 expect(out).not.toContain('demo-logs-bucket');
 expect(out).not.toContain('abc123def4');
 expect(out).not.toContain('d111111abcdef8');
 expect(out).not.toContain('us-east-1_AbCdEf123');
 expect(out).toContain('gov=[AWS_ARN_3].');
});
it('tokenizes AWS and generic request IDs, trace IDs, and cloud/service IDs without false positives',()=>{
 const input=[
  'START RequestId: 11111111-2222-3333-4444-555555555555 Version: $LATEST',
  '2026-11-27T09:00:00.123Z\t22222222-3333-4444-5555-666666666666\tINFO\thello',
  'x-amz-request-id: AMZREQ1234567890',
  'x-amz-id-2: Fgx7AbCdEfGhIjKlMnOpQrStUvWxYz0123456789+/==',
  'x-amz-cf-id: CFID9876543210abcdef==',
  'x-amz-apigw-id: APIGW12345==',
  'X-Amzn-Trace-Id: Root=1-65a1b2c3-0123456789abcdef01234567;Parent=0123456789abcdef;Sampled=1',
  '{"requestId":"req_01HXYZ987654","extendedRequestId":"ext+req/id==","cfId":"cf12345","correlationId":"corr-99887766","traceId":"trc-11223344","id":"33333333-4444-5555-6666-777777777777"}',
  'x-request-id: req-header-9988 traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01 cf-ray: 8a1b2c3d4e5f6789-BOM',
  'project_id=my-gcp-project-42 org_id=org_synthetic_123 order_id=ord_987654',
  'azure=/subscriptions/44444444-5555-6666-7777-888888888888/resourceGroups/prod-rg/providers/Microsoft.Compute',
  'gcp=projects/my-gcp-project-42/secrets/db-pass/versions/1',
  'gcpKey=AIzaSySyntheticExampleKey1234567890abcd stripeWh=whsec_syntheticWebhookSecret123456',
  'INFO request 42 succeeded; request_id=placeholder; project_id=null'
 ].join('\n');
 const out=scan(input,'balanced',s).output;
 expect(out).not.toContain('11111111-2222-3333-4444-555555555555');
 expect(out).not.toContain('22222222-3333-4444-5555-666666666666');
 expect(out).not.toContain('AMZREQ1234567890');
 expect(out).not.toContain('Fgx7AbCdEfGhIjKlMnOpQrStUvWxYz0123456789+/==');
 expect(out).not.toContain('CFID9876543210abcdef==');
 expect(out).not.toContain('APIGW12345==');
 expect(out).not.toContain('65a1b2c3-0123456789abcdef01234567');
 expect(out).not.toContain('req_01HXYZ987654');
 expect(out).not.toContain('ext+req/id==');
 expect(out).not.toContain('cf12345');
 expect(out).not.toContain('corr-99887766');
 expect(out).not.toContain('trc-11223344');
 expect(out).not.toContain('33333333-4444-5555-6666-777777777777');
 expect(out).not.toContain('req-header-9988');
 expect(out).not.toContain('4bf92f3577b34da6a3ce929d0e0e4736');
 expect(out).not.toContain('8a1b2c3d4e5f6789-BOM');
 expect(out).not.toContain('my-gcp-project-42');
 expect(out).not.toContain('org_synthetic_123');
 expect(out).not.toContain('ord_987654');
 expect(out).not.toContain('44444444-5555-6666-7777-888888888888');
 expect(out).not.toContain('AIzaSySyntheticExampleKey1234567890abcd');
 expect(out).not.toContain('whsec_syntheticWebhookSecret123456');
 expect(out).toContain('INFO request 42 succeeded; request_id=placeholder; project_id=null');
});
