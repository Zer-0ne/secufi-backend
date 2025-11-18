class PasswordGeneratorService {
    bankFormats = {
        SBI: {
            keywords: ['sbi', 'state bank', 'statebank'],
            formats: [
                {
                    type: 'account',
                    required: ['account_number'],
                    pattern: (data) => data.account_number,
                },
                {
                    type: 'mobile_last_10',
                    required: ['phone'],
                    pattern: (data) => data.phone?.replace(/\D/g, '').slice(-10),
                },
            ],
        },
        HDFC: {
            keywords: ['hdfc'],
            formats: [
                {
                    type: 'customer_id',
                    required: ['customer_id'],
                    pattern: (data) => data.customer_id,
                },
                {
                    type: 'name_and_card_last_4',
                    required: ['name', 'card_last_4'],
                    pattern: (data) => {
                        const first4 = data.name.substring(0, 4).toUpperCase();
                        return `${first4}${data.card_last_4}`;
                    },
                },
            ],
        },
        ICICI: {
            keywords: ['icici'],
            formats: [
                {
                    type: 'name_dob',
                    required: ['name', 'date_of_birth'],
                    pattern: (data) => {
                        const first4 = data.name.substring(0, 4).toLowerCase();
                        const dob = new Date(data.date_of_birth);
                        const dd = String(dob.getDate()).padStart(2, '0');
                        const mm = String(dob.getMonth() + 1).padStart(2, '0');
                        return `${first4}${dd}${mm}`;
                    },
                },
                {
                    type: 'instant_card_dob',
                    required: ['date_of_birth'],
                    pattern: (data) => {
                        const dob = new Date(data.date_of_birth);
                        const dd = String(dob.getDate()).padStart(2, '0');
                        const mm = String(dob.getMonth() + 1).padStart(2, '0');
                        return `inst${dd}${mm}`;
                    },
                },
            ],
        },
        AXIS: {
            keywords: ['axis'],
            formats: [
                {
                    type: 'name_account',
                    required: ['name', 'account_number'],
                    pattern: (data) => {
                        const first4 = data.name.substring(0, 4).toUpperCase();
                        const last4 = String(data.account_number).slice(-4);
                        return `${first4}${last4}`;
                    },
                },
                {
                    type: 'name_dob',
                    required: ['name', 'date_of_birth'],
                    pattern: (data) => {
                        const first4 = data.name.substring(0, 4).toLowerCase();
                        const dob = new Date(data.date_of_birth);
                        const dd = String(dob.getDate()).padStart(2, '0');
                        const mm = String(dob.getMonth() + 1).padStart(2, '0');
                        return `${first4}${dd}${mm}`;
                    },
                },
            ],
        },
        KOTAK: {
            keywords: ['kotak'],
            formats: [
                {
                    type: 'crn',
                    required: ['customer_id'],
                    pattern: (data) => data.customer_id,
                },
            ],
        },
        IDFC: {
            keywords: ['idfc'],
            formats: [
                {
                    type: 'dob_full',
                    required: ['date_of_birth'],
                    pattern: (data) => {
                        const dob = new Date(data.date_of_birth);
                        const dd = String(dob.getDate()).padStart(2, '0');
                        const mm = String(dob.getMonth() + 1).padStart(2, '0');
                        const yyyy = dob.getFullYear();
                        return `${dd}${mm}${yyyy}`;
                    },
                },
                {
                    type: 'dob_short',
                    required: ['date_of_birth'],
                    pattern: (data) => {
                        const dob = new Date(data.date_of_birth);
                        const dd = String(dob.getDate()).padStart(2, '0');
                        const mm = String(dob.getMonth() + 1).padStart(2, '0');
                        const yy = String(dob.getFullYear()).slice(-2);
                        return `${dd}${mm}${yy}`;
                    },
                },
            ],
        },
        INDUSIND: {
            keywords: ['indusind'],
            formats: [
                {
                    type: 'name_dob',
                    required: ['name', 'date_of_birth'],
                    pattern: (data) => {
                        const first4 = data.name.substring(0, 4).toUpperCase();
                        const dob = new Date(data.date_of_birth);
                        const dd = String(dob.getDate()).padStart(2, '0');
                        const mm = String(dob.getMonth() + 1).padStart(2, '0');
                        return `${first4}${dd}${mm}`;
                    },
                },
            ],
        },
        YES: {
            keywords: ['yes bank', 'yesbank'],
            formats: [
                {
                    type: 'customer_dob',
                    required: ['customer_id', 'date_of_birth'],
                    pattern: (data) => {
                        const dob = new Date(data.date_of_birth);
                        const dd = String(dob.getDate()).padStart(2, '0');
                        const mm = String(dob.getMonth() + 1).padStart(2, '0');
                        const yyyy = dob.getFullYear();
                        return `${data.customer_id}${dd}${mm}${yyyy}`;
                    },
                },
            ],
        },
        RBL: {
            keywords: ['rbl'],
            formats: [
                {
                    type: 'name_dob_full',
                    required: ['name', 'date_of_birth'],
                    pattern: (data) => {
                        const first4 = data.name.substring(0, 4).toUpperCase();
                        const dob = new Date(data.date_of_birth);
                        const dd = String(dob.getDate()).padStart(2, '0');
                        const mm = String(dob.getMonth() + 1).padStart(2, '0');
                        const yyyy = dob.getFullYear();
                        return `${first4}${dd}${mm}${yyyy}`;
                    },
                },
            ],
        },
        CENTRAL_BANK: {
            keywords: ['central bank'],
            formats: [
                {
                    type: 'customer_dob_special',
                    required: ['customer_id', 'date_of_birth'],
                    pattern: (data) => {
                        const dob = new Date(data.date_of_birth);
                        const dd = String(dob.getDate()).padStart(2, '0');
                        const mm = String(dob.getMonth() + 1).padStart(2, '0');
                        const yyyy = dob.getFullYear();
                        return `${data.customer_id}@${dd}${mm}${yyyy}`;
                    },
                },
            ],
        },
    };
    /**
     * 🏦 Detect bank from filename
     */
    detectBank(filename) {
        const lowerFilename = filename.toLowerCase();
        for (const [bankName, bankData] of Object.entries(this.bankFormats)) {
            for (const keyword of bankData.keywords) {
                if (lowerFilename.includes(keyword)) {
                    console.log(`🏦 Detected Bank: ${bankName}`);
                    return { name: bankName, formats: bankData.formats };
                }
            }
        }
        console.log('🏦 Bank not detected');
        return null;
    }
    /**
     * ✅ Check required fields - STRICT MODE
     */
    validateRequiredFields(userData, requiredFields) {
        const missingFields = requiredFields.filter((field) => {
            const value = userData[field];
            return (value === null ||
                value === undefined ||
                value === '' ||
                (typeof value === 'string' && value.trim() === ''));
        });
        return {
            valid: missingFields.length === 0,
            missingFields,
        };
    }
    /**
     * 🔍 Check if bank has ANY valid format
     */
    checkBankHasValidFormat(bank, userData) {
        const allRequiredFields = new Set();
        let hasValidFormat = false;
        bank.formats.forEach((format) => {
            format.required.forEach((field) => allRequiredFields.add(field));
            const validation = this.validateRequiredFields(userData, format.required);
            if (validation.valid) {
                hasValidFormat = true;
            }
        });
        return {
            hasValidFormat,
            allRequiredFields: Array.from(allRequiredFields),
        };
    }
    /**
     * 💡 Generate bank-specific passwords - ONLY IF ALL FORMATS VALID
     */
    generateBankPasswords(bank, userData) {
        const passwords = new Set();
        const skipped = [];
        console.log(`\n📋 Generating passwords for ${bank.name}...`);
        bank.formats.forEach((format) => {
            const validation = this.validateRequiredFields(userData, format.required);
            if (!validation.valid) {
                const reason = `Missing: ${validation.missingFields.join(', ')}`;
                skipped.push({ type: format.type, reason });
                console.log(`   ❌ ${format.type}: ${reason}`);
                return;
            }
            try {
                const password = format.pattern(userData);
                if (password) {
                    passwords.add(password);
                    console.log(`   ✅ ${format.type}: ${password}`);
                }
            }
            catch (error) {
                skipped.push({
                    type: format.type,
                    reason: error.message,
                });
                console.log(`   ❌ ${format.type}: ${error.message}`);
            }
        });
        return {
            passwords: Array.from(passwords),
            skipped,
        };
    }
    /**
     * 🔄 Generate fallback passwords - ONLY IF HAS SOME DATA
     */
    generateFallbackPasswords(userData) {
        const passwords = new Set();
        const { name, date_of_birth, phone, account_number, customer_id, pan_number } = userData;
        // ✅ DOB variations - ONLY if date_of_birth exists
        if (date_of_birth) {
            const dob = new Date(date_of_birth);
            const dd = String(dob.getDate()).padStart(2, '0');
            const mm = String(dob.getMonth() + 1).padStart(2, '0');
            const yyyy = String(dob.getFullYear());
            const yy = yyyy.slice(-2);
            passwords.add(`${dd}${mm}${yyyy}`);
            passwords.add(`${dd}${mm}${yy}`);
            passwords.add(`${yyyy}${mm}${dd}`);
            passwords.add(`${dd}-${mm}-${yyyy}`);
            passwords.add(yyyy);
        }
        // ✅ Account number - ONLY if exists
        if (account_number) {
            passwords.add(String(account_number));
            passwords.add(String(account_number).slice(-4));
        }
        // ✅ Phone - ONLY if exists
        if (phone) {
            const cleaned = phone.replace(/\D/g, '');
            passwords.add(cleaned);
            passwords.add(cleaned.slice(-10));
            passwords.add(cleaned.slice(-4));
        }
        // ✅ Customer ID - ONLY if exists
        if (customer_id) {
            passwords.add(String(customer_id));
        }
        // ✅ PAN - ONLY if exists
        if (pan_number) {
            passwords.add(pan_number.toUpperCase());
            passwords.add(pan_number.toLowerCase());
        }
        // ✅ Name - ONLY if exists
        if (name) {
            passwords.add(name.toLowerCase());
            passwords.add(name.toUpperCase());
            passwords.add(name.substring(0, 4).toLowerCase());
        }
        // ✅ Common passwords - ALWAYS add
        ['', 'password', '123456', '12345678', 'admin', '0000', '1111'].forEach((p) => passwords.add(p));
        return Array.from(passwords);
    }
    /**
     * 🎯 MAIN METHOD - Generate passwords from filename and user data
     * ⚠️  STRICT: If no required fields found, return false
     */
    generatePasswordsForPDF(filename, user) {
        console.log('\n' + '='.repeat(70));
        console.log('🎯 PASSWORD GENERATOR FOR PDF');
        console.log('='.repeat(70));
        console.log(`📄 File: ${filename}`);
        console.log(`👤 User: ${user.email}`);
        // Detect bank
        const bank = this.detectBank(filename);
        // 🔍 IF BANK DETECTED - CHECK REQUIRED FIELDS
        if (bank) {
            console.log(`\n🔍 Checking if required fields exist for ${bank.name}...`);
            const { hasValidFormat, allRequiredFields } = this.checkBankHasValidFormat(bank, user);
            if (!hasValidFormat) {
                console.log(`\n❌ NO VALID FORMAT FOUND FOR THIS BANK`);
                console.log(`\n📋 All formats require these fields:`);
                allRequiredFields.forEach((field) => {
                    const value = user[field];
                    const status = value ? '✅' : '❌';
                    console.log(`   ${status} ${field}: ${value || 'MISSING'}`);
                });
                return {
                    success: false,
                    passwords: [],
                    bankDetected: bank.name,
                    message: `Cannot generate passwords for ${bank.name}. Required fields are missing.`,
                    error: `Please fill these required fields: ${allRequiredFields.join(', ')}`,
                    missingFields: allRequiredFields,
                };
            }
        }
        else {
            console.log(`\n⚠️  Bank not detected from filename`);
        }
        // Generate passwords
        let allPasswords = [];
        const skippedFormats = [];
        // Bank-specific passwords
        if (bank) {
            const { passwords, skipped } = this.generateBankPasswords(bank, user);
            allPasswords.push(...passwords);
            skippedFormats.push(...skipped);
            if (passwords.length === 0) {
                console.log(`\n⚠️  No bank-specific passwords generated`);
                console.log(`\n🔍 Skipped formats:`);
                skipped.forEach(({ type, reason }) => {
                    console.log(`   • ${type}: ${reason}`);
                });
            }
        }
        // Fallback passwords
        const fallbackPasswords = this.generateFallbackPasswords(user);
        allPasswords.push(...fallbackPasswords);
        // Remove duplicates
        allPasswords = Array.from(new Set(allPasswords));
        // ⚠️ STRICT CHECK: If no passwords at all, fail
        if (allPasswords.length === 0) {
            console.log(`\n❌ NO PASSWORDS COULD BE GENERATED`);
            return {
                success: false,
                passwords: [],
                bankDetected: bank?.name || 'Unknown',
                message: 'Failed to generate any passwords',
                error: 'Insufficient user data to generate password candidates',
                missingFields: ['name', 'phone', 'account_number', 'date_of_birth', 'customer_id', 'pan_number'],
            };
        }
        console.log(`\n✅ Successfully generated ${allPasswords.length} password candidates\n`);
        return {
            success: true,
            passwords: allPasswords,
            bankDetected: bank?.name || 'Unknown',
            message: `Successfully generated ${allPasswords.length} password candidates`,
        };
    }
}
export default new PasswordGeneratorService();
//# sourceMappingURL=password-generator.service.js.map