import { User } from '@prisma/client';
interface PasswordGuessResult {
    success: boolean;
    passwords: string[];
    bankDetected?: string;
    message: string;
    missingFields?: string[];
    error?: string;
}
declare class PasswordGeneratorService {
    private bankFormats;
    /**
     * 🏦 Detect bank from filename
     */
    private detectBank;
    /**
     * ✅ Check required fields - STRICT MODE
     */
    private validateRequiredFields;
    /**
     * 🔍 Check if bank has ANY valid format
     */
    private checkBankHasValidFormat;
    /**
     * 💡 Generate bank-specific passwords - ONLY IF ALL FORMATS VALID
     */
    private generateBankPasswords;
    /**
     * 🔄 Generate fallback passwords - ONLY IF HAS SOME DATA
     */
    private generateFallbackPasswords;
    /**
     * 🎯 MAIN METHOD - Generate passwords from filename and user data
     * ⚠️  STRICT: If no required fields found, return false
     */
    generatePasswordsForPDF(filename: string, user: User): PasswordGuessResult;
}
declare const _default: PasswordGeneratorService;
export default _default;
//# sourceMappingURL=password-generator.service.d.ts.map