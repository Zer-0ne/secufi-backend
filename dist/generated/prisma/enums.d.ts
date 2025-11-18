export declare const TransactionType: {
    readonly payment: "payment";
    readonly receipt: "receipt";
    readonly invoice: "invoice";
    readonly statement: "statement";
    readonly other: "other";
};
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];
export declare const TransactionStatus: {
    readonly pending: "pending";
    readonly processed: "processed";
    readonly failed: "failed";
};
export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];
export declare const ParsingStatus: {
    readonly pending: "pending";
    readonly processing: "processing";
    readonly completed: "completed";
    readonly failed: "failed";
};
export type ParsingStatus = (typeof ParsingStatus)[keyof typeof ParsingStatus];
export declare const UploadSource: {
    readonly gmail: "gmail";
    readonly manual: "manual";
    readonly api: "api";
};
export type UploadSource = (typeof UploadSource)[keyof typeof UploadSource];
export declare const GapDetectionStatus: {
    readonly pending: "pending";
    readonly processing: "processing";
    readonly completed: "completed";
    readonly failed: "failed";
};
export type GapDetectionStatus = (typeof GapDetectionStatus)[keyof typeof GapDetectionStatus];
export declare const AutoFillStatus: {
    readonly pending: "pending";
    readonly processing: "processing";
    readonly completed: "completed";
    readonly failed: "failed";
    readonly manual_review: "manual_review";
};
export type AutoFillStatus = (typeof AutoFillStatus)[keyof typeof AutoFillStatus];
export declare const ProcessingMethod: {
    readonly dynamicpdf: "dynamicpdf";
    readonly dynamicpdf_unlocked: "dynamicpdf_unlocked";
    readonly dynamicpdf_unlock_failed: "dynamicpdf_unlock_failed";
    readonly pdf_parse: "pdf_parse";
    readonly pdf_lib: "pdf_lib";
    readonly pdf_lib_ignore_encryption: "pdf_lib_ignore_encryption";
    readonly pdf_lib_ignore_copy: "pdf_lib_ignore_copy";
    readonly pdf_parse_no_password: "pdf_parse_no_password";
    readonly pdf_parse_empty_password: "pdf_parse_empty_password";
    readonly ai: "ai";
    readonly regex: "regex";
    readonly hybrid: "hybrid";
};
export type ProcessingMethod = (typeof ProcessingMethod)[keyof typeof ProcessingMethod];
//# sourceMappingURL=enums.d.ts.map