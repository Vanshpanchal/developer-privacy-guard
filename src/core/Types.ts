export type Profile = 'strict' | 'balanced' | 'credentials';
export type Category = 'credential' | 'cloud' | 'git' | 'database' | 'web-auth' | 'third-party' | 'private-key' | 'network' | 'personal' | 'infrastructure' | 'framework' | 'custom';
export type Action = 'REDACT' | 'TOKENIZE' | 'REVIEW';
export interface Detection { ruleId: string; category: Category; start: number; end: number; confidence: 'HIGH' | 'MEDIUM' | 'LOW'; action: Action; replacement: string; priority: number; tokenType?: string; }
export interface CustomRule { id: string; name: string; category: Category; pattern: string; policy: 'REDACT' | 'TOKENIZE' | 'REVIEW'; enabled: boolean; keywords?: string[]; }
export interface Settings { defaultProfile: Profile; limit: number; enabledCategories: Category[]; customRules: CustomRule[]; confidentialIdentifiers: string[]; protectedDomains: string[]; retainMappings: boolean; }
export interface ScanResult { output: string; detections: Omit<Detection, 'priority' | 'tokenType'>[]; durationMs: number; profile: Profile; warnings: string[]; format: string; }
export const CATEGORIES: Category[] = ['credential','cloud','git','database','web-auth','third-party','private-key','network','personal','infrastructure','framework','custom'];
export const DEFAULT_SETTINGS: Settings = { defaultProfile:'balanced',limit:100000,enabledCategories:[...CATEGORIES],customRules:[],confidentialIdentifiers:[],protectedDomains:[],retainMappings:true };
