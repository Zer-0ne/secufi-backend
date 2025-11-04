export const getExpiryDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.getTime(); // returns a number (timestamp)
};
export const isExpired = (expiryTimestamp) => {
    const now = Date.now();
    return now >= expiryTimestamp; // true = expired, false = still valid
};
export function convertBigIntToString(obj) {
    // Check for null or undefined
    if (obj === null || obj === undefined) {
        return obj;
    }
    // Directly convert BigInt to string
    if (typeof obj === 'bigint') {
        return String(obj);
    }
    // Handle arrays
    if (Array.isArray(obj)) {
        return obj.map(item => convertBigIntToString(item));
    }
    // Handle objects
    if (typeof obj === 'object') {
        const result = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                result[key] = convertBigIntToString(obj[key]);
            }
        }
        return result;
    }
    // Return primitive values as-is
    return obj;
}
//# sourceMappingURL=utils.js.map