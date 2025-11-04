// ============================================================================
// ENUMS
// ============================================================================
export var TransactionType;
(function (TransactionType) {
    TransactionType["PAYMENT"] = "payment";
    TransactionType["RECEIPT"] = "receipt";
    TransactionType["INVOICE"] = "invoice";
    TransactionType["STATEMENT"] = "statement";
    TransactionType["TAX"] = "tax";
    TransactionType["CREDIT_CARD"] = "credit_card";
    TransactionType["BILL"] = "bill";
    TransactionType["OTHER"] = "other";
})(TransactionType || (TransactionType = {}));
export var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["PROCESSED"] = "processed";
    TransactionStatus["FAILED"] = "failed";
})(TransactionStatus || (TransactionStatus = {}));
export var ParsingStatus;
(function (ParsingStatus) {
    ParsingStatus["PENDING"] = "pending";
    ParsingStatus["PROCESSING"] = "processing";
    ParsingStatus["COMPLETED"] = "completed";
    ParsingStatus["FAILED"] = "failed";
})(ParsingStatus || (ParsingStatus = {}));
export var UploadSource;
(function (UploadSource) {
    UploadSource["GMAIL"] = "gmail";
    UploadSource["MANUAL"] = "manual";
    UploadSource["API"] = "api";
})(UploadSource || (UploadSource = {}));
export var GapDetectionStatus;
(function (GapDetectionStatus) {
    GapDetectionStatus["PENDING"] = "pending";
    GapDetectionStatus["PROCESSING"] = "processing";
    GapDetectionStatus["COMPLETED"] = "completed";
    GapDetectionStatus["FAILED"] = "failed";
})(GapDetectionStatus || (GapDetectionStatus = {}));
export var AutoFillStatus;
(function (AutoFillStatus) {
    AutoFillStatus["PENDING"] = "pending";
    AutoFillStatus["PROCESSING"] = "processing";
    AutoFillStatus["COMPLETED"] = "completed";
    AutoFillStatus["FAILED"] = "failed";
    AutoFillStatus["MANUAL_REVIEW"] = "manual_review";
})(AutoFillStatus || (AutoFillStatus = {}));
export var ProcessingMethod;
(function (ProcessingMethod) {
    ProcessingMethod["DYNAMICPDF"] = "dynamicpdf";
    ProcessingMethod["DYNAMICPDF_UNLOCKED"] = "dynamicpdf_unlocked";
    ProcessingMethod["DYNAMICPDF_UNLOCK_FAILED"] = "dynamicpdf_unlock_failed";
    ProcessingMethod["PDF_PARSE"] = "pdf_parse";
    ProcessingMethod["PDF_LIB"] = "pdf_lib";
    ProcessingMethod["PDF_LIB_IGNORE_ENCRYPTION"] = "pdf_lib_ignore_encryption";
    ProcessingMethod["PDF_LIB_IGNORE_COPY"] = "pdf_lib_ignore_copy";
    ProcessingMethod["PDF_PARSE_NO_PASSWORD"] = "pdf_parse_no_password";
    ProcessingMethod["PDF_PARSE_EMPTY_PASSWORD"] = "pdf_parse_empty_password";
    ProcessingMethod["AI"] = "ai";
    ProcessingMethod["REGEX"] = "regex";
    ProcessingMethod["HYBRID"] = "hybrid";
})(ProcessingMethod || (ProcessingMethod = {}));
// ============================================================================
// ASSET INTERFACES
// ============================================================================
export var Status;
(function (Status) {
    Status["ACTIVE"] = "active";
    Status["INACTIVE"] = "inactive";
    Status["PENDING"] = "pending";
    Status["APPROVED"] = "approved";
    Status["REJECTED"] = "rejected";
    Status["UNDER_REVIEW"] = "under_review";
    Status["NEEDS_ATTENTION"] = "needs_attention";
    Status["VERIFIED"] = "verified";
    Status["UNVERIFIED"] = "unverified";
    Status["FLAGGED"] = "flagged";
    Status["ESCALATED"] = "escalated";
    Status["RESOLVED"] = "resolved";
    Status["CLOSED"] = "closed";
    Status["OPEN"] = "open";
    Status["IN_PROGRESS"] = "in_progress";
    Status["ON_HOLD"] = "on_hold";
    Status["COMPLETED"] = "completed";
    Status["CANCELED"] = "canceled";
    Status["DRAFT"] = "draft";
    Status["SUBMITTED"] = "submitted";
    Status["PROCESSING"] = "processing";
})(Status || (Status = {}));
// ============================================================================
// RE-EXPORTS FOR CONVENIENCE
// ============================================================================
// export type {
//   IUser,
//   IUserCreate,
//   IUserUpdate,
//   IGoogleCredential,
//   IGoogleCredentialCreate,
//   IGoogleCredentialUpdate,
//   ISession,
//   ISessionCreate,
//   ISessionUpdate,
//   ITransaction,
//   ITransactionCreate,
//   ITransactionUpdate,
//   IPdfDocument,
//   IPdfDocumentCreate,
//   IPdfDocumentUpdate,
//   IDocument,
//   IDocumentCreate,
//   IDocumentUpdate,
//   IAsset,
//   IAssetCreate,
//   IAssetUpdate,
//   IFamilyAccess,
//   IFamilyAccessCreate,
//   IFamilyAccessUpdate,
//   IApiResponse,
//   IPaginatedResponse,
//   IBatchCreateRequest,
//   IBatchUpdateRequest,
//   IBatchDeleteRequest,
//   IBatchResponse,
// };
//# sourceMappingURL=interfaces.js.map