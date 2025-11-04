import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
export declare const ModelName: {
    readonly User: "User";
    readonly Session: "Session";
    readonly Transaction: "Transaction";
    readonly PdfDocument: "PdfDocument";
    readonly Document: "Document";
    readonly Asset: "Asset";
    readonly FamilyAccess: "FamilyAccess";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly role: "role";
    readonly password: "password";
    readonly otp: "otp";
    readonly otp_expires_at: "otp_expires_at";
    readonly user_type: "user_type";
    readonly google_id: "google_id";
    readonly google_email: "google_email";
    readonly profile_picture: "profile_picture";
    readonly is_google_user: "is_google_user";
    readonly is_verified: "is_verified";
    readonly is_active: "is_active";
    readonly last_login: "last_login";
    readonly phone: "phone";
    readonly address: "address";
    readonly date_of_birth: "date_of_birth";
    readonly gmail_tokens: "gmail_tokens";
    readonly gmail_email: "gmail_email";
    readonly gmail_setup_completed: "gmail_setup_completed";
    readonly pan_number: "pan_number";
    readonly asset_preference: "asset_preference";
    readonly family_role: "family_role";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const SessionScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly session_token: "session_token";
    readonly expires_at: "expires_at";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum];
export declare const TransactionScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly email_id: "email_id";
    readonly subject: "subject";
    readonly sender: "sender";
    readonly recipient: "recipient";
    readonly amount: "amount";
    readonly currency: "currency";
    readonly transaction_type: "transaction_type";
    readonly merchant: "merchant";
    readonly description: "description";
    readonly transaction_date: "transaction_date";
    readonly email_date: "email_date";
    readonly status: "status";
    readonly raw_data: "raw_data";
    readonly extracted_data: "extracted_data";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum];
export declare const PdfDocumentScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly transaction_id: "transaction_id";
    readonly filename: "filename";
    readonly original_filename: "original_filename";
    readonly file_path: "file_path";
    readonly file_size: "file_size";
    readonly mime_type: "mime_type";
    readonly is_password_protected: "is_password_protected";
    readonly password: "password";
    readonly parsing_status: "parsing_status";
    readonly parsing_error: "parsing_error";
    readonly extracted_text: "extracted_text";
    readonly extracted_data: "extracted_data";
    readonly page_count: "page_count";
    readonly upload_source: "upload_source";
    readonly gmail_attachment_id: "gmail_attachment_id";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type PdfDocumentScalarFieldEnum = (typeof PdfDocumentScalarFieldEnum)[keyof typeof PdfDocumentScalarFieldEnum];
export declare const DocumentScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly filename: "filename";
    readonly original_filename: "original_filename";
    readonly file_path: "file_path";
    readonly file_size: "file_size";
    readonly mime_type: "mime_type";
    readonly upload_source: "upload_source";
    readonly parsing_status: "parsing_status";
    readonly parsing_error: "parsing_error";
    readonly extracted_text: "extracted_text";
    readonly document_type: "document_type";
    readonly document_category: "document_category";
    readonly confidence_score: "confidence_score";
    readonly extracted_data: "extracted_data";
    readonly gap_detection_status: "gap_detection_status";
    readonly detected_gaps: "detected_gaps";
    readonly auto_fill_attempts: "auto_fill_attempts";
    readonly auto_fill_status: "auto_fill_status";
    readonly processing_method: "processing_method";
    readonly processing_duration: "processing_duration";
    readonly ai_model_used: "ai_model_used";
    readonly page_count: "page_count";
    readonly is_password_protected: "is_password_protected";
    readonly password: "password";
    readonly data_quality_score: "data_quality_score";
    readonly validation_errors: "validation_errors";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type DocumentScalarFieldEnum = (typeof DocumentScalarFieldEnum)[keyof typeof DocumentScalarFieldEnum];
export declare const AssetScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly name: "name";
    readonly type: "type";
    readonly sub_type: "sub_type";
    readonly account_number: "account_number";
    readonly ifsc_code: "ifsc_code";
    readonly branch_name: "branch_name";
    readonly balance: "balance";
    readonly address: "address";
    readonly nominee: "nominee";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly last_updated: "last_updated";
};
export type AssetScalarFieldEnum = (typeof AssetScalarFieldEnum)[keyof typeof AssetScalarFieldEnum];
export declare const FamilyAccessScalarFieldEnum: {
    readonly id: "id";
    readonly parent_user_id: "parent_user_id";
    readonly family_user_id: "family_user_id";
    readonly asset_id: "asset_id";
    readonly access_expiry: "access_expiry";
    readonly can_edit: "can_edit";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type FamilyAccessScalarFieldEnum = (typeof FamilyAccessScalarFieldEnum)[keyof typeof FamilyAccessScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
    readonly JsonNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const JsonNullValueFilter: {
    readonly DbNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
    readonly JsonNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
    readonly AnyNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map