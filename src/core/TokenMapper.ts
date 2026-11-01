export class TokenMapper {
  private values = new Map<string,string>();
  private counts = new Map<string,number>();
  token(type: string, value: string): string {
    const key = `${type}\0${value}`;
    let token = this.values.get(key);
    if (!token) {
      const next = (this.counts.get(type) ?? 0) + 1;
      this.counts.set(type,next);
      token = `[${type}_${next}]`;
      this.values.set(key,token);
    }
    return token;
  }
  clear(): void { this.values.clear(); this.counts.clear(); }
}
