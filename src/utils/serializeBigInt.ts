export function serializeBigInt(value: any): any {
  if (value === null || value === undefined) return value;

  if (typeof value === 'bigint') return value.toString();

  if (Array.isArray(value)) {
    return value.map(serializeBigInt);
  }

  if (typeof value === 'object') {
    const out: any = {};
    for (const key in value) {
      out[key] = serializeBigInt(value[key]);
    }
    return out;
  }

  return value;
}
