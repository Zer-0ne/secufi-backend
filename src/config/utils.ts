export const getExpiryDate = (days: number): number => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.getTime(); // returns a number (timestamp)
};

export const isExpired = (expiryTimestamp: number): boolean => {
  const now = Date.now();
  return now >= expiryTimestamp; // true = expired, false = still valid
};


export function convertBigIntToString<T = any>(obj: T): T {
  // Check for null or undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Directly convert BigInt to string
  if (typeof obj === 'bigint') {
    return String(obj) as T;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => convertBigIntToString(item)) as T;
  }

  // Handle objects
  if (typeof obj === 'object') {
    const result: any = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = convertBigIntToString(obj[key]);
      }
    }
    
    return result as T;
  }

  // Return primitive values as-is
  return obj;
}
