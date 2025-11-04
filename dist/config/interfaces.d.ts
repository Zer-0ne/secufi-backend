export declare enum TransactionType {
    PAYMENT = "payment",
    RECEIPT = "receipt",
    INVOICE = "invoice",
    STATEMENT = "statement",
    TAX = "tax",
    CREDIT_CARD = "credit_card",
    BILL = "bill",
    OTHER = "other"
}
export declare enum TransactionStatus {
    PENDING = "pending",
    PROCESSED = "processed",
    FAILED = "failed"
}
export declare enum ParsingStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare enum UploadSource {
    GMAIL = "gmail",
    MANUAL = "manual",
    API = "api"
}
export declare enum GapDetectionStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare enum AutoFillStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    MANUAL_REVIEW = "manual_review"
}
export declare enum ProcessingMethod {
    DYNAMICPDF = "dynamicpdf",
    DYNAMICPDF_UNLOCKED = "dynamicpdf_unlocked",
    DYNAMICPDF_UNLOCK_FAILED = "dynamicpdf_unlock_failed",
    PDF_PARSE = "pdf_parse",
    PDF_LIB = "pdf_lib",
    PDF_LIB_IGNORE_ENCRYPTION = "pdf_lib_ignore_encryption",
    PDF_LIB_IGNORE_COPY = "pdf_lib_ignore_copy",
    PDF_PARSE_NO_PASSWORD = "pdf_parse_no_password",
    PDF_PARSE_EMPTY_PASSWORD = "pdf_parse_empty_password",
    AI = "ai",
    REGEX = "regex",
    HYBRID = "hybrid"
}
export interface IUser {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    password?: string | null;
    otp?: string | null;
    otp_expires_at?: Date | null;
    user_type?: string | null;
    google_id?: string | null;
    google_email?: string | null;
    profile_picture?: string | null;
    is_google_user: boolean;
    is_verified: boolean;
    is_active: boolean;
    last_login?: Date | null;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: Date | null;
    pan_number?: string | null;
    asset_preference?: Record<string, any> | null;
    customer_id?: string | null;
    account_number?: string | null;
    family_role?: string | null;
    created_at: Date;
    updated_at: Date;
}
export interface IUserCreate {
    name?: string;
    email?: string;
    role?: string;
    password?: string;
    user_type?: string;
    google_id?: string;
    google_email?: string;
    profile_picture?: string;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    phone?: string;
    address?: string;
    date_of_birth?: Date;
    pan_number?: string;
    asset_preference?: Record<string, any>;
    customer_id?: string;
    account_number?: string;
    family_role?: string;
}
export interface IUserUpdate {
    name?: string;
    email?: string;
    role?: string;
    password?: string;
    otp?: string;
    otp_expires_at?: Date;
    user_type?: string;
    google_id?: string;
    google_email?: string;
    profile_picture?: string;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: Date;
    phone?: string;
    address?: string;
    date_of_birth?: Date;
    pan_number?: string;
    asset_preference?: Record<string, any>;
    customer_id?: string;
    account_number?: string;
    family_role?: string;
}
export interface IGoogleCredential {
    id: string;
    user_id: string;
    encrypted_access_token: string;
    encrypted_refresh_token: string;
    access_token_expires_at: Date;
    refresh_token_expires_at: Date;
    access_token_iv: string;
    refresh_token_iv: string;
    expires_at: Date;
    created_at: Date;
    updated_at: Date;
}
export interface IGoogleCredentialCreate {
    user_id: string;
    encrypted_access_token: string;
    encrypted_refresh_token: string;
    access_token_expires_at: Date;
    refresh_token_expires_at: Date;
    access_token_iv: string;
    refresh_token_iv: string;
    expires_at: Date;
}
export interface IGoogleCredentialUpdate {
    encrypted_access_token?: string;
    encrypted_refresh_token?: string;
    access_token_expires_at?: Date;
    refresh_token_expires_at?: Date;
    access_token_iv?: string;
    refresh_token_iv?: string;
    expires_at?: Date;
}
export interface ISession {
    id: string;
    user_id: string;
    session_token: string;
    expires_at: Date;
    created_at: Date;
    updated_at: Date;
}
export interface ISessionCreate {
    user_id: string;
    session_token: string;
    expires_at: Date;
}
export interface ISessionUpdate {
    session_token?: string;
    expires_at?: Date;
}
export interface ITransaction {
    id: string;
    user_id: string;
    email_id: string;
    subject?: string | null;
    sender: string;
    recipient: string;
    amount?: string | number | null;
    currency?: string | null;
    transaction_type: string;
    merchant?: string | null;
    description?: string | null;
    transaction_date?: Date | null;
    email_date: Date;
    status: string;
    raw_data?: Record<string, any> | null;
    extracted_data?: Record<string, any> | null;
    created_at: Date;
    updated_at: Date;
}
export interface ITransactionCreate {
    user_id: string;
    email_id: string;
    subject?: string;
    sender: string;
    recipient: string;
    amount?: string | number;
    currency?: string;
    transaction_type?: string;
    merchant?: string;
    description?: string;
    transaction_date?: Date;
    email_date: Date;
    status?: string;
    raw_data?: Record<string, any>;
    extracted_data?: Record<string, any>;
}
export interface ITransactionUpdate {
    subject?: string;
    sender?: string;
    recipient?: string;
    amount?: string | number;
    currency?: string;
    transaction_type?: string;
    merchant?: string;
    description?: string;
    transaction_date?: Date;
    status?: string;
    raw_data?: Record<string, any>;
    extracted_data?: Record<string, any>;
}
export interface IPdfDocument {
    id: string;
    user_id: string;
    transaction_id?: string | null;
    filename: string;
    original_filename: string;
    file_path?: string | null;
    file_size: bigint;
    mime_type: string;
    parsing_status: string;
    parsing_error?: string | null;
    extracted_text?: string | null;
    extracted_data?: Record<string, any> | null;
    page_count?: number | null;
    upload_source: string;
    gmail_attachment_id?: string | null;
    created_at: Date;
    updated_at: Date;
}
export interface IPdfDocumentCreate {
    user_id: string;
    transaction_id?: string;
    filename: string;
    original_filename: string;
    file_path?: string;
    file_size: bigint;
    mime_type?: string;
    parsing_status?: string;
    upload_source?: string;
    gmail_attachment_id?: string;
}
export interface IPdfDocumentUpdate {
    filename?: string;
    original_filename?: string;
    file_path?: string;
    mime_type?: string;
    parsing_status?: string;
    parsing_error?: string;
    extracted_text?: string;
    extracted_data?: Record<string, any>;
    page_count?: number;
    upload_source?: string;
    gmail_attachment_id?: string;
    transaction_id?: string;
}
export interface IDocument {
    id: string;
    user_id: string;
    filename: string;
    original_filename: string;
    file_path?: string | null;
    file_size: bigint;
    mime_type: string;
    upload_source?: string | null;
    parsing_status: string;
    parsing_error?: string | null;
    extracted_text?: string | null;
    document_type?: string | null;
    document_category?: string | null;
    confidence_score?: number | null;
    extracted_data?: Record<string, any> | null;
    gap_detection_status: string;
    detected_gaps?: Record<string, any> | null;
    auto_fill_attempts?: Record<string, any> | null;
    auto_fill_status: string;
    processing_method?: string | null;
    processing_duration?: number | null;
    ai_model_used?: string | null;
    page_count?: number | null;
    is_password_protected: boolean;
    password?: string | null;
    data_quality_score?: number | null;
    validation_errors?: Record<string, any> | null;
    created_at: Date;
    updated_at: Date;
}
export interface IDocumentCreate {
    user_id: string;
    filename: string;
    original_filename: string;
    file_path?: string;
    file_size: bigint;
    mime_type?: string;
    upload_source?: string;
    parsing_status?: string;
    document_type?: string;
    document_category?: string;
    confidence_score?: number;
    extracted_data?: Record<string, any>;
    gap_detection_status?: string;
    detected_gaps?: Record<string, any>;
    auto_fill_attempts?: Record<string, any>;
    auto_fill_status?: string;
    processing_method?: string;
    ai_model_used?: string;
    page_count?: number;
    is_password_protected?: boolean;
    password?: string;
    data_quality_score?: number;
    validation_errors?: Record<string, any>;
}
export interface IDocumentUpdate {
    filename?: string;
    original_filename?: string;
    file_path?: string;
    mime_type?: string;
    upload_source?: string;
    parsing_status?: string;
    parsing_error?: string;
    extracted_text?: string;
    document_type?: string;
    document_category?: string;
    confidence_score?: number;
    extracted_data?: Record<string, any>;
    gap_detection_status?: string;
    detected_gaps?: Record<string, any>;
    auto_fill_attempts?: Record<string, any>;
    auto_fill_status?: string;
    processing_method?: string;
    processing_duration?: number;
    ai_model_used?: string;
    page_count?: number;
    is_password_protected?: boolean;
    password?: string;
    data_quality_score?: number;
    validation_errors?: Record<string, any>;
}
export declare enum Status {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    UNDER_REVIEW = "under_review",
    NEEDS_ATTENTION = "needs_attention",
    VERIFIED = "verified",
    UNVERIFIED = "unverified",
    FLAGGED = "flagged",
    ESCALATED = "escalated",
    RESOLVED = "resolved",
    CLOSED = "closed",
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    ON_HOLD = "on_hold",
    COMPLETED = "completed",
    CANCELED = "canceled",
    DRAFT = "draft",
    SUBMITTED = "submitted",
    PROCESSING = "processing"
}
export interface IAsset {
    id: string;
    user_id: string;
    name?: string | null;
    type: string;
    sub_type?: string | null;
    account_number?: string | null;
    ifsc_code?: string | null;
    branch_name?: string | null;
    bank_name?: string | null;
    balance?: string | number | null;
    total_value?: string | number | null;
    status?: Status | null;
    last_updated: Date;
    address?: string | null;
    nominee?: Record<string, any> | null;
    policy_number?: string | null;
    fund_name?: string | null;
    folio_number?: string | null;
    document_type?: string | null;
    document_metadata?: Record<string, any> | null;
    file_name?: string | null;
    file_size?: number | null;
    mime_type?: string | null;
    file_content?: string | null;
    transaction_id?: string | null;
    email_id?: string | null;
    created_at: Date;
    updated_at: Date;
}
export interface IAssetCreate {
    user_id: string;
    name?: string;
    type: string;
    sub_type?: string;
    account_number?: string;
    ifsc_code?: string;
    branch_name?: string;
    bank_name?: string;
    balance?: string | number;
    total_value?: string | number;
    status?: Status;
    address?: string;
    nominee?: Record<string, any>;
    policy_number?: string;
    fund_name?: string;
    folio_number?: string;
    document_type?: string;
    document_metadata?: Record<string, any>;
    file_name?: string;
    file_size?: number;
    mime_type?: string;
    file_content?: string;
    transaction_id?: string;
    email_id?: string;
}
export interface IAssetUpdate {
    name?: string;
    type?: string;
    sub_type?: string;
    account_number?: string;
    ifsc_code?: string;
    branch_name?: string;
    bank_name?: string;
    balance?: string | number;
    total_value?: string | number;
    status?: Status;
    last_updated?: Date;
    address?: string;
    nominee?: Record<string, any>;
    policy_number?: string;
    fund_name?: string;
    folio_number?: string;
    document_type?: string;
    document_metadata?: Record<string, any>;
    file_name?: string;
    file_size?: number;
    mime_type?: string;
    file_content?: string;
    transaction_id?: string;
    email_id?: string;
}
export interface IFamilyAccess {
    id: string;
    parent_user_id: string;
    family_user_id: string;
    asset_id: string;
    access_expiry?: Date | null;
    can_edit: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface IFamilyAccessCreate {
    parent_user_id: string;
    family_user_id: string;
    asset_id: string;
    access_expiry?: Date;
    can_edit?: boolean;
}
export interface IFamilyAccessUpdate {
    access_expiry?: Date;
    can_edit?: boolean;
}
export interface IApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string | Record<string, any>;
}
export interface IPaginatedResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface IBatchCreateRequest<T> {
    items: T[];
    skipOnError?: boolean;
}
export interface IBatchUpdateRequest<T> {
    updates: Array<{
        id: string;
        data: T;
    }>;
    skipOnError?: boolean;
}
export interface IBatchDeleteRequest {
    ids: string[];
    skipOnError?: boolean;
}
export interface IBatchResponse<T> {
    success: boolean;
    message: string;
    successCount: number;
    failureCount: number;
    results: Array<{
        id?: string;
        success: boolean;
        data?: T;
        error?: string;
    }>;
}
//# sourceMappingURL=interfaces.d.ts.map