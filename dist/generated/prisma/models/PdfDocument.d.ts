import type * as runtime from "@prisma/client/runtime/library";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model PdfDocument
 *
 */
export type PdfDocumentModel = runtime.Types.Result.DefaultSelection<Prisma.$PdfDocumentPayload>;
export type AggregatePdfDocument = {
    _count: PdfDocumentCountAggregateOutputType | null;
    _avg: PdfDocumentAvgAggregateOutputType | null;
    _sum: PdfDocumentSumAggregateOutputType | null;
    _min: PdfDocumentMinAggregateOutputType | null;
    _max: PdfDocumentMaxAggregateOutputType | null;
};
export type PdfDocumentAvgAggregateOutputType = {
    file_size: number | null;
    page_count: number | null;
};
export type PdfDocumentSumAggregateOutputType = {
    file_size: bigint | null;
    page_count: number | null;
};
export type PdfDocumentMinAggregateOutputType = {
    id: string | null;
    user_id: string | null;
    transaction_id: string | null;
    filename: string | null;
    original_filename: string | null;
    file_path: string | null;
    file_size: bigint | null;
    mime_type: string | null;
    is_password_protected: boolean | null;
    password: string | null;
    parsing_status: $Enums.ParsingStatus | null;
    parsing_error: string | null;
    extracted_text: string | null;
    page_count: number | null;
    upload_source: $Enums.UploadSource | null;
    gmail_attachment_id: string | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type PdfDocumentMaxAggregateOutputType = {
    id: string | null;
    user_id: string | null;
    transaction_id: string | null;
    filename: string | null;
    original_filename: string | null;
    file_path: string | null;
    file_size: bigint | null;
    mime_type: string | null;
    is_password_protected: boolean | null;
    password: string | null;
    parsing_status: $Enums.ParsingStatus | null;
    parsing_error: string | null;
    extracted_text: string | null;
    page_count: number | null;
    upload_source: $Enums.UploadSource | null;
    gmail_attachment_id: string | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type PdfDocumentCountAggregateOutputType = {
    id: number;
    user_id: number;
    transaction_id: number;
    filename: number;
    original_filename: number;
    file_path: number;
    file_size: number;
    mime_type: number;
    is_password_protected: number;
    password: number;
    parsing_status: number;
    parsing_error: number;
    extracted_text: number;
    extracted_data: number;
    page_count: number;
    upload_source: number;
    gmail_attachment_id: number;
    created_at: number;
    updated_at: number;
    _all: number;
};
export type PdfDocumentAvgAggregateInputType = {
    file_size?: true;
    page_count?: true;
};
export type PdfDocumentSumAggregateInputType = {
    file_size?: true;
    page_count?: true;
};
export type PdfDocumentMinAggregateInputType = {
    id?: true;
    user_id?: true;
    transaction_id?: true;
    filename?: true;
    original_filename?: true;
    file_path?: true;
    file_size?: true;
    mime_type?: true;
    is_password_protected?: true;
    password?: true;
    parsing_status?: true;
    parsing_error?: true;
    extracted_text?: true;
    page_count?: true;
    upload_source?: true;
    gmail_attachment_id?: true;
    created_at?: true;
    updated_at?: true;
};
export type PdfDocumentMaxAggregateInputType = {
    id?: true;
    user_id?: true;
    transaction_id?: true;
    filename?: true;
    original_filename?: true;
    file_path?: true;
    file_size?: true;
    mime_type?: true;
    is_password_protected?: true;
    password?: true;
    parsing_status?: true;
    parsing_error?: true;
    extracted_text?: true;
    page_count?: true;
    upload_source?: true;
    gmail_attachment_id?: true;
    created_at?: true;
    updated_at?: true;
};
export type PdfDocumentCountAggregateInputType = {
    id?: true;
    user_id?: true;
    transaction_id?: true;
    filename?: true;
    original_filename?: true;
    file_path?: true;
    file_size?: true;
    mime_type?: true;
    is_password_protected?: true;
    password?: true;
    parsing_status?: true;
    parsing_error?: true;
    extracted_text?: true;
    extracted_data?: true;
    page_count?: true;
    upload_source?: true;
    gmail_attachment_id?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
};
export type PdfDocumentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which PdfDocument to aggregate.
     */
    where?: Prisma.PdfDocumentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PdfDocuments to fetch.
     */
    orderBy?: Prisma.PdfDocumentOrderByWithRelationInput | Prisma.PdfDocumentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.PdfDocumentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PdfDocuments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PdfDocuments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned PdfDocuments
    **/
    _count?: true | PdfDocumentCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: PdfDocumentAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: PdfDocumentSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: PdfDocumentMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: PdfDocumentMaxAggregateInputType;
};
export type GetPdfDocumentAggregateType<T extends PdfDocumentAggregateArgs> = {
    [P in keyof T & keyof AggregatePdfDocument]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePdfDocument[P]> : Prisma.GetScalarType<T[P], AggregatePdfDocument[P]>;
};
export type PdfDocumentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PdfDocumentWhereInput;
    orderBy?: Prisma.PdfDocumentOrderByWithAggregationInput | Prisma.PdfDocumentOrderByWithAggregationInput[];
    by: Prisma.PdfDocumentScalarFieldEnum[] | Prisma.PdfDocumentScalarFieldEnum;
    having?: Prisma.PdfDocumentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PdfDocumentCountAggregateInputType | true;
    _avg?: PdfDocumentAvgAggregateInputType;
    _sum?: PdfDocumentSumAggregateInputType;
    _min?: PdfDocumentMinAggregateInputType;
    _max?: PdfDocumentMaxAggregateInputType;
};
export type PdfDocumentGroupByOutputType = {
    id: string;
    user_id: string;
    transaction_id: string | null;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: bigint;
    mime_type: string;
    is_password_protected: boolean;
    password: string | null;
    parsing_status: $Enums.ParsingStatus;
    parsing_error: string | null;
    extracted_text: string | null;
    extracted_data: runtime.JsonValue | null;
    page_count: number | null;
    upload_source: $Enums.UploadSource;
    gmail_attachment_id: string | null;
    created_at: Date;
    updated_at: Date;
    _count: PdfDocumentCountAggregateOutputType | null;
    _avg: PdfDocumentAvgAggregateOutputType | null;
    _sum: PdfDocumentSumAggregateOutputType | null;
    _min: PdfDocumentMinAggregateOutputType | null;
    _max: PdfDocumentMaxAggregateOutputType | null;
};
type GetPdfDocumentGroupByPayload<T extends PdfDocumentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PdfDocumentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PdfDocumentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PdfDocumentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PdfDocumentGroupByOutputType[P]>;
}>>;
export type PdfDocumentWhereInput = {
    AND?: Prisma.PdfDocumentWhereInput | Prisma.PdfDocumentWhereInput[];
    OR?: Prisma.PdfDocumentWhereInput[];
    NOT?: Prisma.PdfDocumentWhereInput | Prisma.PdfDocumentWhereInput[];
    id?: Prisma.UuidFilter<"PdfDocument"> | string;
    user_id?: Prisma.UuidFilter<"PdfDocument"> | string;
    transaction_id?: Prisma.UuidNullableFilter<"PdfDocument"> | string | null;
    filename?: Prisma.StringFilter<"PdfDocument"> | string;
    original_filename?: Prisma.StringFilter<"PdfDocument"> | string;
    file_path?: Prisma.StringFilter<"PdfDocument"> | string;
    file_size?: Prisma.BigIntFilter<"PdfDocument"> | bigint | number;
    mime_type?: Prisma.StringFilter<"PdfDocument"> | string;
    is_password_protected?: Prisma.BoolFilter<"PdfDocument"> | boolean;
    password?: Prisma.StringNullableFilter<"PdfDocument"> | string | null;
    parsing_status?: Prisma.EnumParsingStatusFilter<"PdfDocument"> | $Enums.ParsingStatus;
    parsing_error?: Prisma.StringNullableFilter<"PdfDocument"> | string | null;
    extracted_text?: Prisma.StringNullableFilter<"PdfDocument"> | string | null;
    extracted_data?: Prisma.JsonNullableFilter<"PdfDocument">;
    page_count?: Prisma.IntNullableFilter<"PdfDocument"> | number | null;
    upload_source?: Prisma.EnumUploadSourceFilter<"PdfDocument"> | $Enums.UploadSource;
    gmail_attachment_id?: Prisma.StringNullableFilter<"PdfDocument"> | string | null;
    created_at?: Prisma.DateTimeFilter<"PdfDocument"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"PdfDocument"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    transaction?: Prisma.XOR<Prisma.TransactionNullableScalarRelationFilter, Prisma.TransactionWhereInput> | null;
};
export type PdfDocumentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    transaction_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    filename?: Prisma.SortOrder;
    original_filename?: Prisma.SortOrder;
    file_path?: Prisma.SortOrder;
    file_size?: Prisma.SortOrder;
    mime_type?: Prisma.SortOrder;
    is_password_protected?: Prisma.SortOrder;
    password?: Prisma.SortOrderInput | Prisma.SortOrder;
    parsing_status?: Prisma.SortOrder;
    parsing_error?: Prisma.SortOrderInput | Prisma.SortOrder;
    extracted_text?: Prisma.SortOrderInput | Prisma.SortOrder;
    extracted_data?: Prisma.SortOrderInput | Prisma.SortOrder;
    page_count?: Prisma.SortOrderInput | Prisma.SortOrder;
    upload_source?: Prisma.SortOrder;
    gmail_attachment_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    transaction?: Prisma.TransactionOrderByWithRelationInput;
};
export type PdfDocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.PdfDocumentWhereInput | Prisma.PdfDocumentWhereInput[];
    OR?: Prisma.PdfDocumentWhereInput[];
    NOT?: Prisma.PdfDocumentWhereInput | Prisma.PdfDocumentWhereInput[];
    user_id?: Prisma.UuidFilter<"PdfDocument"> | string;
    transaction_id?: Prisma.UuidNullableFilter<"PdfDocument"> | string | null;
    filename?: Prisma.StringFilter<"PdfDocument"> | string;
    original_filename?: Prisma.StringFilter<"PdfDocument"> | string;
    file_path?: Prisma.StringFilter<"PdfDocument"> | string;
    file_size?: Prisma.BigIntFilter<"PdfDocument"> | bigint | number;
    mime_type?: Prisma.StringFilter<"PdfDocument"> | string;
    is_password_protected?: Prisma.BoolFilter<"PdfDocument"> | boolean;
    password?: Prisma.StringNullableFilter<"PdfDocument"> | string | null;
    parsing_status?: Prisma.EnumParsingStatusFilter<"PdfDocument"> | $Enums.ParsingStatus;
    parsing_error?: Prisma.StringNullableFilter<"PdfDocument"> | string | null;
    extracted_text?: Prisma.StringNullableFilter<"PdfDocument"> | string | null;
    extracted_data?: Prisma.JsonNullableFilter<"PdfDocument">;
    page_count?: Prisma.IntNullableFilter<"PdfDocument"> | number | null;
    upload_source?: Prisma.EnumUploadSourceFilter<"PdfDocument"> | $Enums.UploadSource;
    gmail_attachment_id?: Prisma.StringNullableFilter<"PdfDocument"> | string | null;
    created_at?: Prisma.DateTimeFilter<"PdfDocument"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"PdfDocument"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    transaction?: Prisma.XOR<Prisma.TransactionNullableScalarRelationFilter, Prisma.TransactionWhereInput> | null;
}, "id">;
export type PdfDocumentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    transaction_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    filename?: Prisma.SortOrder;
    original_filename?: Prisma.SortOrder;
    file_path?: Prisma.SortOrder;
    file_size?: Prisma.SortOrder;
    mime_type?: Prisma.SortOrder;
    is_password_protected?: Prisma.SortOrder;
    password?: Prisma.SortOrderInput | Prisma.SortOrder;
    parsing_status?: Prisma.SortOrder;
    parsing_error?: Prisma.SortOrderInput | Prisma.SortOrder;
    extracted_text?: Prisma.SortOrderInput | Prisma.SortOrder;
    extracted_data?: Prisma.SortOrderInput | Prisma.SortOrder;
    page_count?: Prisma.SortOrderInput | Prisma.SortOrder;
    upload_source?: Prisma.SortOrder;
    gmail_attachment_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    _count?: Prisma.PdfDocumentCountOrderByAggregateInput;
    _avg?: Prisma.PdfDocumentAvgOrderByAggregateInput;
    _max?: Prisma.PdfDocumentMaxOrderByAggregateInput;
    _min?: Prisma.PdfDocumentMinOrderByAggregateInput;
    _sum?: Prisma.PdfDocumentSumOrderByAggregateInput;
};
export type PdfDocumentScalarWhereWithAggregatesInput = {
    AND?: Prisma.PdfDocumentScalarWhereWithAggregatesInput | Prisma.PdfDocumentScalarWhereWithAggregatesInput[];
    OR?: Prisma.PdfDocumentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PdfDocumentScalarWhereWithAggregatesInput | Prisma.PdfDocumentScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"PdfDocument"> | string;
    user_id?: Prisma.UuidWithAggregatesFilter<"PdfDocument"> | string;
    transaction_id?: Prisma.UuidNullableWithAggregatesFilter<"PdfDocument"> | string | null;
    filename?: Prisma.StringWithAggregatesFilter<"PdfDocument"> | string;
    original_filename?: Prisma.StringWithAggregatesFilter<"PdfDocument"> | string;
    file_path?: Prisma.StringWithAggregatesFilter<"PdfDocument"> | string;
    file_size?: Prisma.BigIntWithAggregatesFilter<"PdfDocument"> | bigint | number;
    mime_type?: Prisma.StringWithAggregatesFilter<"PdfDocument"> | string;
    is_password_protected?: Prisma.BoolWithAggregatesFilter<"PdfDocument"> | boolean;
    password?: Prisma.StringNullableWithAggregatesFilter<"PdfDocument"> | string | null;
    parsing_status?: Prisma.EnumParsingStatusWithAggregatesFilter<"PdfDocument"> | $Enums.ParsingStatus;
    parsing_error?: Prisma.StringNullableWithAggregatesFilter<"PdfDocument"> | string | null;
    extracted_text?: Prisma.StringNullableWithAggregatesFilter<"PdfDocument"> | string | null;
    extracted_data?: Prisma.JsonNullableWithAggregatesFilter<"PdfDocument">;
    page_count?: Prisma.IntNullableWithAggregatesFilter<"PdfDocument"> | number | null;
    upload_source?: Prisma.EnumUploadSourceWithAggregatesFilter<"PdfDocument"> | $Enums.UploadSource;
    gmail_attachment_id?: Prisma.StringNullableWithAggregatesFilter<"PdfDocument"> | string | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"PdfDocument"> | Date | string;
    updated_at?: Prisma.DateTimeWithAggregatesFilter<"PdfDocument"> | Date | string;
};
export type PdfDocumentCreateInput = {
    id?: string;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: bigint | number;
    mime_type?: string;
    is_password_protected?: boolean;
    password?: string | null;
    parsing_status?: $Enums.ParsingStatus;
    parsing_error?: string | null;
    extracted_text?: string | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    page_count?: number | null;
    upload_source?: $Enums.UploadSource;
    gmail_attachment_id?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutPdf_documentsInput;
    transaction?: Prisma.TransactionCreateNestedOneWithoutPdf_documentsInput;
};
export type PdfDocumentUncheckedCreateInput = {
    id?: string;
    user_id: string;
    transaction_id?: string | null;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: bigint | number;
    mime_type?: string;
    is_password_protected?: boolean;
    password?: string | null;
    parsing_status?: $Enums.ParsingStatus;
    parsing_error?: string | null;
    extracted_text?: string | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    page_count?: number | null;
    upload_source?: $Enums.UploadSource;
    gmail_attachment_id?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type PdfDocumentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    original_filename?: Prisma.StringFieldUpdateOperationsInput | string;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    file_size?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    mime_type?: Prisma.StringFieldUpdateOperationsInput | string;
    is_password_protected?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parsing_status?: Prisma.EnumParsingStatusFieldUpdateOperationsInput | $Enums.ParsingStatus;
    parsing_error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    page_count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    upload_source?: Prisma.EnumUploadSourceFieldUpdateOperationsInput | $Enums.UploadSource;
    gmail_attachment_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutPdf_documentsNestedInput;
    transaction?: Prisma.TransactionUpdateOneWithoutPdf_documentsNestedInput;
};
export type PdfDocumentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    transaction_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    original_filename?: Prisma.StringFieldUpdateOperationsInput | string;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    file_size?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    mime_type?: Prisma.StringFieldUpdateOperationsInput | string;
    is_password_protected?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parsing_status?: Prisma.EnumParsingStatusFieldUpdateOperationsInput | $Enums.ParsingStatus;
    parsing_error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    page_count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    upload_source?: Prisma.EnumUploadSourceFieldUpdateOperationsInput | $Enums.UploadSource;
    gmail_attachment_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PdfDocumentCreateManyInput = {
    id?: string;
    user_id: string;
    transaction_id?: string | null;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: bigint | number;
    mime_type?: string;
    is_password_protected?: boolean;
    password?: string | null;
    parsing_status?: $Enums.ParsingStatus;
    parsing_error?: string | null;
    extracted_text?: string | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    page_count?: number | null;
    upload_source?: $Enums.UploadSource;
    gmail_attachment_id?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type PdfDocumentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    original_filename?: Prisma.StringFieldUpdateOperationsInput | string;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    file_size?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    mime_type?: Prisma.StringFieldUpdateOperationsInput | string;
    is_password_protected?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parsing_status?: Prisma.EnumParsingStatusFieldUpdateOperationsInput | $Enums.ParsingStatus;
    parsing_error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    page_count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    upload_source?: Prisma.EnumUploadSourceFieldUpdateOperationsInput | $Enums.UploadSource;
    gmail_attachment_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PdfDocumentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    transaction_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    original_filename?: Prisma.StringFieldUpdateOperationsInput | string;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    file_size?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    mime_type?: Prisma.StringFieldUpdateOperationsInput | string;
    is_password_protected?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parsing_status?: Prisma.EnumParsingStatusFieldUpdateOperationsInput | $Enums.ParsingStatus;
    parsing_error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    page_count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    upload_source?: Prisma.EnumUploadSourceFieldUpdateOperationsInput | $Enums.UploadSource;
    gmail_attachment_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PdfDocumentListRelationFilter = {
    every?: Prisma.PdfDocumentWhereInput;
    some?: Prisma.PdfDocumentWhereInput;
    none?: Prisma.PdfDocumentWhereInput;
};
export type PdfDocumentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PdfDocumentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    transaction_id?: Prisma.SortOrder;
    filename?: Prisma.SortOrder;
    original_filename?: Prisma.SortOrder;
    file_path?: Prisma.SortOrder;
    file_size?: Prisma.SortOrder;
    mime_type?: Prisma.SortOrder;
    is_password_protected?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    parsing_status?: Prisma.SortOrder;
    parsing_error?: Prisma.SortOrder;
    extracted_text?: Prisma.SortOrder;
    extracted_data?: Prisma.SortOrder;
    page_count?: Prisma.SortOrder;
    upload_source?: Prisma.SortOrder;
    gmail_attachment_id?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type PdfDocumentAvgOrderByAggregateInput = {
    file_size?: Prisma.SortOrder;
    page_count?: Prisma.SortOrder;
};
export type PdfDocumentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    transaction_id?: Prisma.SortOrder;
    filename?: Prisma.SortOrder;
    original_filename?: Prisma.SortOrder;
    file_path?: Prisma.SortOrder;
    file_size?: Prisma.SortOrder;
    mime_type?: Prisma.SortOrder;
    is_password_protected?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    parsing_status?: Prisma.SortOrder;
    parsing_error?: Prisma.SortOrder;
    extracted_text?: Prisma.SortOrder;
    page_count?: Prisma.SortOrder;
    upload_source?: Prisma.SortOrder;
    gmail_attachment_id?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type PdfDocumentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    transaction_id?: Prisma.SortOrder;
    filename?: Prisma.SortOrder;
    original_filename?: Prisma.SortOrder;
    file_path?: Prisma.SortOrder;
    file_size?: Prisma.SortOrder;
    mime_type?: Prisma.SortOrder;
    is_password_protected?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    parsing_status?: Prisma.SortOrder;
    parsing_error?: Prisma.SortOrder;
    extracted_text?: Prisma.SortOrder;
    page_count?: Prisma.SortOrder;
    upload_source?: Prisma.SortOrder;
    gmail_attachment_id?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type PdfDocumentSumOrderByAggregateInput = {
    file_size?: Prisma.SortOrder;
    page_count?: Prisma.SortOrder;
};
export type PdfDocumentCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.PdfDocumentCreateWithoutUserInput, Prisma.PdfDocumentUncheckedCreateWithoutUserInput> | Prisma.PdfDocumentCreateWithoutUserInput[] | Prisma.PdfDocumentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PdfDocumentCreateOrConnectWithoutUserInput | Prisma.PdfDocumentCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.PdfDocumentCreateManyUserInputEnvelope;
    connect?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
};
export type PdfDocumentUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.PdfDocumentCreateWithoutUserInput, Prisma.PdfDocumentUncheckedCreateWithoutUserInput> | Prisma.PdfDocumentCreateWithoutUserInput[] | Prisma.PdfDocumentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PdfDocumentCreateOrConnectWithoutUserInput | Prisma.PdfDocumentCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.PdfDocumentCreateManyUserInputEnvelope;
    connect?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
};
export type PdfDocumentUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.PdfDocumentCreateWithoutUserInput, Prisma.PdfDocumentUncheckedCreateWithoutUserInput> | Prisma.PdfDocumentCreateWithoutUserInput[] | Prisma.PdfDocumentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PdfDocumentCreateOrConnectWithoutUserInput | Prisma.PdfDocumentCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.PdfDocumentUpsertWithWhereUniqueWithoutUserInput | Prisma.PdfDocumentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.PdfDocumentCreateManyUserInputEnvelope;
    set?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
    disconnect?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
    delete?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
    connect?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
    update?: Prisma.PdfDocumentUpdateWithWhereUniqueWithoutUserInput | Prisma.PdfDocumentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.PdfDocumentUpdateManyWithWhereWithoutUserInput | Prisma.PdfDocumentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.PdfDocumentScalarWhereInput | Prisma.PdfDocumentScalarWhereInput[];
};
export type PdfDocumentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.PdfDocumentCreateWithoutUserInput, Prisma.PdfDocumentUncheckedCreateWithoutUserInput> | Prisma.PdfDocumentCreateWithoutUserInput[] | Prisma.PdfDocumentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.PdfDocumentCreateOrConnectWithoutUserInput | Prisma.PdfDocumentCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.PdfDocumentUpsertWithWhereUniqueWithoutUserInput | Prisma.PdfDocumentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.PdfDocumentCreateManyUserInputEnvelope;
    set?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
    disconnect?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
    delete?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
    connect?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
    update?: Prisma.PdfDocumentUpdateWithWhereUniqueWithoutUserInput | Prisma.PdfDocumentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.PdfDocumentUpdateManyWithWhereWithoutUserInput | Prisma.PdfDocumentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.PdfDocumentScalarWhereInput | Prisma.PdfDocumentScalarWhereInput[];
};
export type PdfDocumentCreateNestedManyWithoutTransactionInput = {
    create?: Prisma.XOR<Prisma.PdfDocumentCreateWithoutTransactionInput, Prisma.PdfDocumentUncheckedCreateWithoutTransactionInput> | Prisma.PdfDocumentCreateWithoutTransactionInput[] | Prisma.PdfDocumentUncheckedCreateWithoutTransactionInput[];
    connectOrCreate?: Prisma.PdfDocumentCreateOrConnectWithoutTransactionInput | Prisma.PdfDocumentCreateOrConnectWithoutTransactionInput[];
    createMany?: Prisma.PdfDocumentCreateManyTransactionInputEnvelope;
    connect?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
};
export type PdfDocumentUncheckedCreateNestedManyWithoutTransactionInput = {
    create?: Prisma.XOR<Prisma.PdfDocumentCreateWithoutTransactionInput, Prisma.PdfDocumentUncheckedCreateWithoutTransactionInput> | Prisma.PdfDocumentCreateWithoutTransactionInput[] | Prisma.PdfDocumentUncheckedCreateWithoutTransactionInput[];
    connectOrCreate?: Prisma.PdfDocumentCreateOrConnectWithoutTransactionInput | Prisma.PdfDocumentCreateOrConnectWithoutTransactionInput[];
    createMany?: Prisma.PdfDocumentCreateManyTransactionInputEnvelope;
    connect?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
};
export type PdfDocumentUpdateManyWithoutTransactionNestedInput = {
    create?: Prisma.XOR<Prisma.PdfDocumentCreateWithoutTransactionInput, Prisma.PdfDocumentUncheckedCreateWithoutTransactionInput> | Prisma.PdfDocumentCreateWithoutTransactionInput[] | Prisma.PdfDocumentUncheckedCreateWithoutTransactionInput[];
    connectOrCreate?: Prisma.PdfDocumentCreateOrConnectWithoutTransactionInput | Prisma.PdfDocumentCreateOrConnectWithoutTransactionInput[];
    upsert?: Prisma.PdfDocumentUpsertWithWhereUniqueWithoutTransactionInput | Prisma.PdfDocumentUpsertWithWhereUniqueWithoutTransactionInput[];
    createMany?: Prisma.PdfDocumentCreateManyTransactionInputEnvelope;
    set?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
    disconnect?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
    delete?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
    connect?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
    update?: Prisma.PdfDocumentUpdateWithWhereUniqueWithoutTransactionInput | Prisma.PdfDocumentUpdateWithWhereUniqueWithoutTransactionInput[];
    updateMany?: Prisma.PdfDocumentUpdateManyWithWhereWithoutTransactionInput | Prisma.PdfDocumentUpdateManyWithWhereWithoutTransactionInput[];
    deleteMany?: Prisma.PdfDocumentScalarWhereInput | Prisma.PdfDocumentScalarWhereInput[];
};
export type PdfDocumentUncheckedUpdateManyWithoutTransactionNestedInput = {
    create?: Prisma.XOR<Prisma.PdfDocumentCreateWithoutTransactionInput, Prisma.PdfDocumentUncheckedCreateWithoutTransactionInput> | Prisma.PdfDocumentCreateWithoutTransactionInput[] | Prisma.PdfDocumentUncheckedCreateWithoutTransactionInput[];
    connectOrCreate?: Prisma.PdfDocumentCreateOrConnectWithoutTransactionInput | Prisma.PdfDocumentCreateOrConnectWithoutTransactionInput[];
    upsert?: Prisma.PdfDocumentUpsertWithWhereUniqueWithoutTransactionInput | Prisma.PdfDocumentUpsertWithWhereUniqueWithoutTransactionInput[];
    createMany?: Prisma.PdfDocumentCreateManyTransactionInputEnvelope;
    set?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
    disconnect?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
    delete?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
    connect?: Prisma.PdfDocumentWhereUniqueInput | Prisma.PdfDocumentWhereUniqueInput[];
    update?: Prisma.PdfDocumentUpdateWithWhereUniqueWithoutTransactionInput | Prisma.PdfDocumentUpdateWithWhereUniqueWithoutTransactionInput[];
    updateMany?: Prisma.PdfDocumentUpdateManyWithWhereWithoutTransactionInput | Prisma.PdfDocumentUpdateManyWithWhereWithoutTransactionInput[];
    deleteMany?: Prisma.PdfDocumentScalarWhereInput | Prisma.PdfDocumentScalarWhereInput[];
};
export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number;
    increment?: bigint | number;
    decrement?: bigint | number;
    multiply?: bigint | number;
    divide?: bigint | number;
};
export type EnumParsingStatusFieldUpdateOperationsInput = {
    set?: $Enums.ParsingStatus;
};
export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type EnumUploadSourceFieldUpdateOperationsInput = {
    set?: $Enums.UploadSource;
};
export type PdfDocumentCreateWithoutUserInput = {
    id?: string;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: bigint | number;
    mime_type?: string;
    is_password_protected?: boolean;
    password?: string | null;
    parsing_status?: $Enums.ParsingStatus;
    parsing_error?: string | null;
    extracted_text?: string | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    page_count?: number | null;
    upload_source?: $Enums.UploadSource;
    gmail_attachment_id?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    transaction?: Prisma.TransactionCreateNestedOneWithoutPdf_documentsInput;
};
export type PdfDocumentUncheckedCreateWithoutUserInput = {
    id?: string;
    transaction_id?: string | null;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: bigint | number;
    mime_type?: string;
    is_password_protected?: boolean;
    password?: string | null;
    parsing_status?: $Enums.ParsingStatus;
    parsing_error?: string | null;
    extracted_text?: string | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    page_count?: number | null;
    upload_source?: $Enums.UploadSource;
    gmail_attachment_id?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type PdfDocumentCreateOrConnectWithoutUserInput = {
    where: Prisma.PdfDocumentWhereUniqueInput;
    create: Prisma.XOR<Prisma.PdfDocumentCreateWithoutUserInput, Prisma.PdfDocumentUncheckedCreateWithoutUserInput>;
};
export type PdfDocumentCreateManyUserInputEnvelope = {
    data: Prisma.PdfDocumentCreateManyUserInput | Prisma.PdfDocumentCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type PdfDocumentUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.PdfDocumentWhereUniqueInput;
    update: Prisma.XOR<Prisma.PdfDocumentUpdateWithoutUserInput, Prisma.PdfDocumentUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.PdfDocumentCreateWithoutUserInput, Prisma.PdfDocumentUncheckedCreateWithoutUserInput>;
};
export type PdfDocumentUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.PdfDocumentWhereUniqueInput;
    data: Prisma.XOR<Prisma.PdfDocumentUpdateWithoutUserInput, Prisma.PdfDocumentUncheckedUpdateWithoutUserInput>;
};
export type PdfDocumentUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.PdfDocumentScalarWhereInput;
    data: Prisma.XOR<Prisma.PdfDocumentUpdateManyMutationInput, Prisma.PdfDocumentUncheckedUpdateManyWithoutUserInput>;
};
export type PdfDocumentScalarWhereInput = {
    AND?: Prisma.PdfDocumentScalarWhereInput | Prisma.PdfDocumentScalarWhereInput[];
    OR?: Prisma.PdfDocumentScalarWhereInput[];
    NOT?: Prisma.PdfDocumentScalarWhereInput | Prisma.PdfDocumentScalarWhereInput[];
    id?: Prisma.UuidFilter<"PdfDocument"> | string;
    user_id?: Prisma.UuidFilter<"PdfDocument"> | string;
    transaction_id?: Prisma.UuidNullableFilter<"PdfDocument"> | string | null;
    filename?: Prisma.StringFilter<"PdfDocument"> | string;
    original_filename?: Prisma.StringFilter<"PdfDocument"> | string;
    file_path?: Prisma.StringFilter<"PdfDocument"> | string;
    file_size?: Prisma.BigIntFilter<"PdfDocument"> | bigint | number;
    mime_type?: Prisma.StringFilter<"PdfDocument"> | string;
    is_password_protected?: Prisma.BoolFilter<"PdfDocument"> | boolean;
    password?: Prisma.StringNullableFilter<"PdfDocument"> | string | null;
    parsing_status?: Prisma.EnumParsingStatusFilter<"PdfDocument"> | $Enums.ParsingStatus;
    parsing_error?: Prisma.StringNullableFilter<"PdfDocument"> | string | null;
    extracted_text?: Prisma.StringNullableFilter<"PdfDocument"> | string | null;
    extracted_data?: Prisma.JsonNullableFilter<"PdfDocument">;
    page_count?: Prisma.IntNullableFilter<"PdfDocument"> | number | null;
    upload_source?: Prisma.EnumUploadSourceFilter<"PdfDocument"> | $Enums.UploadSource;
    gmail_attachment_id?: Prisma.StringNullableFilter<"PdfDocument"> | string | null;
    created_at?: Prisma.DateTimeFilter<"PdfDocument"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"PdfDocument"> | Date | string;
};
export type PdfDocumentCreateWithoutTransactionInput = {
    id?: string;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: bigint | number;
    mime_type?: string;
    is_password_protected?: boolean;
    password?: string | null;
    parsing_status?: $Enums.ParsingStatus;
    parsing_error?: string | null;
    extracted_text?: string | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    page_count?: number | null;
    upload_source?: $Enums.UploadSource;
    gmail_attachment_id?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutPdf_documentsInput;
};
export type PdfDocumentUncheckedCreateWithoutTransactionInput = {
    id?: string;
    user_id: string;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: bigint | number;
    mime_type?: string;
    is_password_protected?: boolean;
    password?: string | null;
    parsing_status?: $Enums.ParsingStatus;
    parsing_error?: string | null;
    extracted_text?: string | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    page_count?: number | null;
    upload_source?: $Enums.UploadSource;
    gmail_attachment_id?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type PdfDocumentCreateOrConnectWithoutTransactionInput = {
    where: Prisma.PdfDocumentWhereUniqueInput;
    create: Prisma.XOR<Prisma.PdfDocumentCreateWithoutTransactionInput, Prisma.PdfDocumentUncheckedCreateWithoutTransactionInput>;
};
export type PdfDocumentCreateManyTransactionInputEnvelope = {
    data: Prisma.PdfDocumentCreateManyTransactionInput | Prisma.PdfDocumentCreateManyTransactionInput[];
    skipDuplicates?: boolean;
};
export type PdfDocumentUpsertWithWhereUniqueWithoutTransactionInput = {
    where: Prisma.PdfDocumentWhereUniqueInput;
    update: Prisma.XOR<Prisma.PdfDocumentUpdateWithoutTransactionInput, Prisma.PdfDocumentUncheckedUpdateWithoutTransactionInput>;
    create: Prisma.XOR<Prisma.PdfDocumentCreateWithoutTransactionInput, Prisma.PdfDocumentUncheckedCreateWithoutTransactionInput>;
};
export type PdfDocumentUpdateWithWhereUniqueWithoutTransactionInput = {
    where: Prisma.PdfDocumentWhereUniqueInput;
    data: Prisma.XOR<Prisma.PdfDocumentUpdateWithoutTransactionInput, Prisma.PdfDocumentUncheckedUpdateWithoutTransactionInput>;
};
export type PdfDocumentUpdateManyWithWhereWithoutTransactionInput = {
    where: Prisma.PdfDocumentScalarWhereInput;
    data: Prisma.XOR<Prisma.PdfDocumentUpdateManyMutationInput, Prisma.PdfDocumentUncheckedUpdateManyWithoutTransactionInput>;
};
export type PdfDocumentCreateManyUserInput = {
    id?: string;
    transaction_id?: string | null;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: bigint | number;
    mime_type?: string;
    is_password_protected?: boolean;
    password?: string | null;
    parsing_status?: $Enums.ParsingStatus;
    parsing_error?: string | null;
    extracted_text?: string | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    page_count?: number | null;
    upload_source?: $Enums.UploadSource;
    gmail_attachment_id?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type PdfDocumentUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    original_filename?: Prisma.StringFieldUpdateOperationsInput | string;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    file_size?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    mime_type?: Prisma.StringFieldUpdateOperationsInput | string;
    is_password_protected?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parsing_status?: Prisma.EnumParsingStatusFieldUpdateOperationsInput | $Enums.ParsingStatus;
    parsing_error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    page_count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    upload_source?: Prisma.EnumUploadSourceFieldUpdateOperationsInput | $Enums.UploadSource;
    gmail_attachment_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transaction?: Prisma.TransactionUpdateOneWithoutPdf_documentsNestedInput;
};
export type PdfDocumentUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    transaction_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    original_filename?: Prisma.StringFieldUpdateOperationsInput | string;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    file_size?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    mime_type?: Prisma.StringFieldUpdateOperationsInput | string;
    is_password_protected?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parsing_status?: Prisma.EnumParsingStatusFieldUpdateOperationsInput | $Enums.ParsingStatus;
    parsing_error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    page_count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    upload_source?: Prisma.EnumUploadSourceFieldUpdateOperationsInput | $Enums.UploadSource;
    gmail_attachment_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PdfDocumentUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    transaction_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    original_filename?: Prisma.StringFieldUpdateOperationsInput | string;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    file_size?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    mime_type?: Prisma.StringFieldUpdateOperationsInput | string;
    is_password_protected?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parsing_status?: Prisma.EnumParsingStatusFieldUpdateOperationsInput | $Enums.ParsingStatus;
    parsing_error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    page_count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    upload_source?: Prisma.EnumUploadSourceFieldUpdateOperationsInput | $Enums.UploadSource;
    gmail_attachment_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PdfDocumentCreateManyTransactionInput = {
    id?: string;
    user_id: string;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: bigint | number;
    mime_type?: string;
    is_password_protected?: boolean;
    password?: string | null;
    parsing_status?: $Enums.ParsingStatus;
    parsing_error?: string | null;
    extracted_text?: string | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    page_count?: number | null;
    upload_source?: $Enums.UploadSource;
    gmail_attachment_id?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type PdfDocumentUpdateWithoutTransactionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    original_filename?: Prisma.StringFieldUpdateOperationsInput | string;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    file_size?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    mime_type?: Prisma.StringFieldUpdateOperationsInput | string;
    is_password_protected?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parsing_status?: Prisma.EnumParsingStatusFieldUpdateOperationsInput | $Enums.ParsingStatus;
    parsing_error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    page_count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    upload_source?: Prisma.EnumUploadSourceFieldUpdateOperationsInput | $Enums.UploadSource;
    gmail_attachment_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutPdf_documentsNestedInput;
};
export type PdfDocumentUncheckedUpdateWithoutTransactionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    original_filename?: Prisma.StringFieldUpdateOperationsInput | string;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    file_size?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    mime_type?: Prisma.StringFieldUpdateOperationsInput | string;
    is_password_protected?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parsing_status?: Prisma.EnumParsingStatusFieldUpdateOperationsInput | $Enums.ParsingStatus;
    parsing_error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    page_count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    upload_source?: Prisma.EnumUploadSourceFieldUpdateOperationsInput | $Enums.UploadSource;
    gmail_attachment_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PdfDocumentUncheckedUpdateManyWithoutTransactionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    original_filename?: Prisma.StringFieldUpdateOperationsInput | string;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    file_size?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    mime_type?: Prisma.StringFieldUpdateOperationsInput | string;
    is_password_protected?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parsing_status?: Prisma.EnumParsingStatusFieldUpdateOperationsInput | $Enums.ParsingStatus;
    parsing_error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    page_count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    upload_source?: Prisma.EnumUploadSourceFieldUpdateOperationsInput | $Enums.UploadSource;
    gmail_attachment_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PdfDocumentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    user_id?: boolean;
    transaction_id?: boolean;
    filename?: boolean;
    original_filename?: boolean;
    file_path?: boolean;
    file_size?: boolean;
    mime_type?: boolean;
    is_password_protected?: boolean;
    password?: boolean;
    parsing_status?: boolean;
    parsing_error?: boolean;
    extracted_text?: boolean;
    extracted_data?: boolean;
    page_count?: boolean;
    upload_source?: boolean;
    gmail_attachment_id?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    transaction?: boolean | Prisma.PdfDocument$transactionArgs<ExtArgs>;
}, ExtArgs["result"]["pdfDocument"]>;
export type PdfDocumentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    user_id?: boolean;
    transaction_id?: boolean;
    filename?: boolean;
    original_filename?: boolean;
    file_path?: boolean;
    file_size?: boolean;
    mime_type?: boolean;
    is_password_protected?: boolean;
    password?: boolean;
    parsing_status?: boolean;
    parsing_error?: boolean;
    extracted_text?: boolean;
    extracted_data?: boolean;
    page_count?: boolean;
    upload_source?: boolean;
    gmail_attachment_id?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    transaction?: boolean | Prisma.PdfDocument$transactionArgs<ExtArgs>;
}, ExtArgs["result"]["pdfDocument"]>;
export type PdfDocumentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    user_id?: boolean;
    transaction_id?: boolean;
    filename?: boolean;
    original_filename?: boolean;
    file_path?: boolean;
    file_size?: boolean;
    mime_type?: boolean;
    is_password_protected?: boolean;
    password?: boolean;
    parsing_status?: boolean;
    parsing_error?: boolean;
    extracted_text?: boolean;
    extracted_data?: boolean;
    page_count?: boolean;
    upload_source?: boolean;
    gmail_attachment_id?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    transaction?: boolean | Prisma.PdfDocument$transactionArgs<ExtArgs>;
}, ExtArgs["result"]["pdfDocument"]>;
export type PdfDocumentSelectScalar = {
    id?: boolean;
    user_id?: boolean;
    transaction_id?: boolean;
    filename?: boolean;
    original_filename?: boolean;
    file_path?: boolean;
    file_size?: boolean;
    mime_type?: boolean;
    is_password_protected?: boolean;
    password?: boolean;
    parsing_status?: boolean;
    parsing_error?: boolean;
    extracted_text?: boolean;
    extracted_data?: boolean;
    page_count?: boolean;
    upload_source?: boolean;
    gmail_attachment_id?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
};
export type PdfDocumentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "user_id" | "transaction_id" | "filename" | "original_filename" | "file_path" | "file_size" | "mime_type" | "is_password_protected" | "password" | "parsing_status" | "parsing_error" | "extracted_text" | "extracted_data" | "page_count" | "upload_source" | "gmail_attachment_id" | "created_at" | "updated_at", ExtArgs["result"]["pdfDocument"]>;
export type PdfDocumentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    transaction?: boolean | Prisma.PdfDocument$transactionArgs<ExtArgs>;
};
export type PdfDocumentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    transaction?: boolean | Prisma.PdfDocument$transactionArgs<ExtArgs>;
};
export type PdfDocumentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    transaction?: boolean | Prisma.PdfDocument$transactionArgs<ExtArgs>;
};
export type $PdfDocumentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PdfDocument";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        transaction: Prisma.$TransactionPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        user_id: string;
        transaction_id: string | null;
        filename: string;
        original_filename: string;
        file_path: string;
        file_size: bigint;
        mime_type: string;
        is_password_protected: boolean;
        password: string | null;
        parsing_status: $Enums.ParsingStatus;
        parsing_error: string | null;
        extracted_text: string | null;
        extracted_data: runtime.JsonValue | null;
        page_count: number | null;
        upload_source: $Enums.UploadSource;
        gmail_attachment_id: string | null;
        created_at: Date;
        updated_at: Date;
    }, ExtArgs["result"]["pdfDocument"]>;
    composites: {};
};
export type PdfDocumentGetPayload<S extends boolean | null | undefined | PdfDocumentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PdfDocumentPayload, S>;
export type PdfDocumentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PdfDocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PdfDocumentCountAggregateInputType | true;
};
export interface PdfDocumentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PdfDocument'];
        meta: {
            name: 'PdfDocument';
        };
    };
    /**
     * Find zero or one PdfDocument that matches the filter.
     * @param {PdfDocumentFindUniqueArgs} args - Arguments to find a PdfDocument
     * @example
     * // Get one PdfDocument
     * const pdfDocument = await prisma.pdfDocument.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PdfDocumentFindUniqueArgs>(args: Prisma.SelectSubset<T, PdfDocumentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PdfDocumentClient<runtime.Types.Result.GetResult<Prisma.$PdfDocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one PdfDocument that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PdfDocumentFindUniqueOrThrowArgs} args - Arguments to find a PdfDocument
     * @example
     * // Get one PdfDocument
     * const pdfDocument = await prisma.pdfDocument.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PdfDocumentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PdfDocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PdfDocumentClient<runtime.Types.Result.GetResult<Prisma.$PdfDocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first PdfDocument that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PdfDocumentFindFirstArgs} args - Arguments to find a PdfDocument
     * @example
     * // Get one PdfDocument
     * const pdfDocument = await prisma.pdfDocument.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PdfDocumentFindFirstArgs>(args?: Prisma.SelectSubset<T, PdfDocumentFindFirstArgs<ExtArgs>>): Prisma.Prisma__PdfDocumentClient<runtime.Types.Result.GetResult<Prisma.$PdfDocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first PdfDocument that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PdfDocumentFindFirstOrThrowArgs} args - Arguments to find a PdfDocument
     * @example
     * // Get one PdfDocument
     * const pdfDocument = await prisma.pdfDocument.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PdfDocumentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PdfDocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PdfDocumentClient<runtime.Types.Result.GetResult<Prisma.$PdfDocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more PdfDocuments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PdfDocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PdfDocuments
     * const pdfDocuments = await prisma.pdfDocument.findMany()
     *
     * // Get first 10 PdfDocuments
     * const pdfDocuments = await prisma.pdfDocument.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const pdfDocumentWithIdOnly = await prisma.pdfDocument.findMany({ select: { id: true } })
     *
     */
    findMany<T extends PdfDocumentFindManyArgs>(args?: Prisma.SelectSubset<T, PdfDocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PdfDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a PdfDocument.
     * @param {PdfDocumentCreateArgs} args - Arguments to create a PdfDocument.
     * @example
     * // Create one PdfDocument
     * const PdfDocument = await prisma.pdfDocument.create({
     *   data: {
     *     // ... data to create a PdfDocument
     *   }
     * })
     *
     */
    create<T extends PdfDocumentCreateArgs>(args: Prisma.SelectSubset<T, PdfDocumentCreateArgs<ExtArgs>>): Prisma.Prisma__PdfDocumentClient<runtime.Types.Result.GetResult<Prisma.$PdfDocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many PdfDocuments.
     * @param {PdfDocumentCreateManyArgs} args - Arguments to create many PdfDocuments.
     * @example
     * // Create many PdfDocuments
     * const pdfDocument = await prisma.pdfDocument.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends PdfDocumentCreateManyArgs>(args?: Prisma.SelectSubset<T, PdfDocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many PdfDocuments and returns the data saved in the database.
     * @param {PdfDocumentCreateManyAndReturnArgs} args - Arguments to create many PdfDocuments.
     * @example
     * // Create many PdfDocuments
     * const pdfDocument = await prisma.pdfDocument.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many PdfDocuments and only return the `id`
     * const pdfDocumentWithIdOnly = await prisma.pdfDocument.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends PdfDocumentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PdfDocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PdfDocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a PdfDocument.
     * @param {PdfDocumentDeleteArgs} args - Arguments to delete one PdfDocument.
     * @example
     * // Delete one PdfDocument
     * const PdfDocument = await prisma.pdfDocument.delete({
     *   where: {
     *     // ... filter to delete one PdfDocument
     *   }
     * })
     *
     */
    delete<T extends PdfDocumentDeleteArgs>(args: Prisma.SelectSubset<T, PdfDocumentDeleteArgs<ExtArgs>>): Prisma.Prisma__PdfDocumentClient<runtime.Types.Result.GetResult<Prisma.$PdfDocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one PdfDocument.
     * @param {PdfDocumentUpdateArgs} args - Arguments to update one PdfDocument.
     * @example
     * // Update one PdfDocument
     * const pdfDocument = await prisma.pdfDocument.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends PdfDocumentUpdateArgs>(args: Prisma.SelectSubset<T, PdfDocumentUpdateArgs<ExtArgs>>): Prisma.Prisma__PdfDocumentClient<runtime.Types.Result.GetResult<Prisma.$PdfDocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more PdfDocuments.
     * @param {PdfDocumentDeleteManyArgs} args - Arguments to filter PdfDocuments to delete.
     * @example
     * // Delete a few PdfDocuments
     * const { count } = await prisma.pdfDocument.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends PdfDocumentDeleteManyArgs>(args?: Prisma.SelectSubset<T, PdfDocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more PdfDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PdfDocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PdfDocuments
     * const pdfDocument = await prisma.pdfDocument.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends PdfDocumentUpdateManyArgs>(args: Prisma.SelectSubset<T, PdfDocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more PdfDocuments and returns the data updated in the database.
     * @param {PdfDocumentUpdateManyAndReturnArgs} args - Arguments to update many PdfDocuments.
     * @example
     * // Update many PdfDocuments
     * const pdfDocument = await prisma.pdfDocument.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more PdfDocuments and only return the `id`
     * const pdfDocumentWithIdOnly = await prisma.pdfDocument.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends PdfDocumentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PdfDocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PdfDocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one PdfDocument.
     * @param {PdfDocumentUpsertArgs} args - Arguments to update or create a PdfDocument.
     * @example
     * // Update or create a PdfDocument
     * const pdfDocument = await prisma.pdfDocument.upsert({
     *   create: {
     *     // ... data to create a PdfDocument
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PdfDocument we want to update
     *   }
     * })
     */
    upsert<T extends PdfDocumentUpsertArgs>(args: Prisma.SelectSubset<T, PdfDocumentUpsertArgs<ExtArgs>>): Prisma.Prisma__PdfDocumentClient<runtime.Types.Result.GetResult<Prisma.$PdfDocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of PdfDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PdfDocumentCountArgs} args - Arguments to filter PdfDocuments to count.
     * @example
     * // Count the number of PdfDocuments
     * const count = await prisma.pdfDocument.count({
     *   where: {
     *     // ... the filter for the PdfDocuments we want to count
     *   }
     * })
    **/
    count<T extends PdfDocumentCountArgs>(args?: Prisma.Subset<T, PdfDocumentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PdfDocumentCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a PdfDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PdfDocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PdfDocumentAggregateArgs>(args: Prisma.Subset<T, PdfDocumentAggregateArgs>): Prisma.PrismaPromise<GetPdfDocumentAggregateType<T>>;
    /**
     * Group by PdfDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PdfDocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends PdfDocumentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PdfDocumentGroupByArgs['orderBy'];
    } : {
        orderBy?: PdfDocumentGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PdfDocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPdfDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the PdfDocument model
     */
    readonly fields: PdfDocumentFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for PdfDocument.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__PdfDocumentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    transaction<T extends Prisma.PdfDocument$transactionArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PdfDocument$transactionArgs<ExtArgs>>): Prisma.Prisma__TransactionClient<runtime.Types.Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the PdfDocument model
 */
export interface PdfDocumentFieldRefs {
    readonly id: Prisma.FieldRef<"PdfDocument", 'String'>;
    readonly user_id: Prisma.FieldRef<"PdfDocument", 'String'>;
    readonly transaction_id: Prisma.FieldRef<"PdfDocument", 'String'>;
    readonly filename: Prisma.FieldRef<"PdfDocument", 'String'>;
    readonly original_filename: Prisma.FieldRef<"PdfDocument", 'String'>;
    readonly file_path: Prisma.FieldRef<"PdfDocument", 'String'>;
    readonly file_size: Prisma.FieldRef<"PdfDocument", 'BigInt'>;
    readonly mime_type: Prisma.FieldRef<"PdfDocument", 'String'>;
    readonly is_password_protected: Prisma.FieldRef<"PdfDocument", 'Boolean'>;
    readonly password: Prisma.FieldRef<"PdfDocument", 'String'>;
    readonly parsing_status: Prisma.FieldRef<"PdfDocument", 'ParsingStatus'>;
    readonly parsing_error: Prisma.FieldRef<"PdfDocument", 'String'>;
    readonly extracted_text: Prisma.FieldRef<"PdfDocument", 'String'>;
    readonly extracted_data: Prisma.FieldRef<"PdfDocument", 'Json'>;
    readonly page_count: Prisma.FieldRef<"PdfDocument", 'Int'>;
    readonly upload_source: Prisma.FieldRef<"PdfDocument", 'UploadSource'>;
    readonly gmail_attachment_id: Prisma.FieldRef<"PdfDocument", 'String'>;
    readonly created_at: Prisma.FieldRef<"PdfDocument", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"PdfDocument", 'DateTime'>;
}
/**
 * PdfDocument findUnique
 */
export type PdfDocumentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PdfDocument
     */
    select?: Prisma.PdfDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PdfDocument
     */
    omit?: Prisma.PdfDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PdfDocumentInclude<ExtArgs> | null;
    /**
     * Filter, which PdfDocument to fetch.
     */
    where: Prisma.PdfDocumentWhereUniqueInput;
};
/**
 * PdfDocument findUniqueOrThrow
 */
export type PdfDocumentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PdfDocument
     */
    select?: Prisma.PdfDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PdfDocument
     */
    omit?: Prisma.PdfDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PdfDocumentInclude<ExtArgs> | null;
    /**
     * Filter, which PdfDocument to fetch.
     */
    where: Prisma.PdfDocumentWhereUniqueInput;
};
/**
 * PdfDocument findFirst
 */
export type PdfDocumentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PdfDocument
     */
    select?: Prisma.PdfDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PdfDocument
     */
    omit?: Prisma.PdfDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PdfDocumentInclude<ExtArgs> | null;
    /**
     * Filter, which PdfDocument to fetch.
     */
    where?: Prisma.PdfDocumentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PdfDocuments to fetch.
     */
    orderBy?: Prisma.PdfDocumentOrderByWithRelationInput | Prisma.PdfDocumentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PdfDocuments.
     */
    cursor?: Prisma.PdfDocumentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PdfDocuments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PdfDocuments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PdfDocuments.
     */
    distinct?: Prisma.PdfDocumentScalarFieldEnum | Prisma.PdfDocumentScalarFieldEnum[];
};
/**
 * PdfDocument findFirstOrThrow
 */
export type PdfDocumentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PdfDocument
     */
    select?: Prisma.PdfDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PdfDocument
     */
    omit?: Prisma.PdfDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PdfDocumentInclude<ExtArgs> | null;
    /**
     * Filter, which PdfDocument to fetch.
     */
    where?: Prisma.PdfDocumentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PdfDocuments to fetch.
     */
    orderBy?: Prisma.PdfDocumentOrderByWithRelationInput | Prisma.PdfDocumentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PdfDocuments.
     */
    cursor?: Prisma.PdfDocumentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PdfDocuments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PdfDocuments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PdfDocuments.
     */
    distinct?: Prisma.PdfDocumentScalarFieldEnum | Prisma.PdfDocumentScalarFieldEnum[];
};
/**
 * PdfDocument findMany
 */
export type PdfDocumentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PdfDocument
     */
    select?: Prisma.PdfDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PdfDocument
     */
    omit?: Prisma.PdfDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PdfDocumentInclude<ExtArgs> | null;
    /**
     * Filter, which PdfDocuments to fetch.
     */
    where?: Prisma.PdfDocumentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PdfDocuments to fetch.
     */
    orderBy?: Prisma.PdfDocumentOrderByWithRelationInput | Prisma.PdfDocumentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing PdfDocuments.
     */
    cursor?: Prisma.PdfDocumentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PdfDocuments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PdfDocuments.
     */
    skip?: number;
    distinct?: Prisma.PdfDocumentScalarFieldEnum | Prisma.PdfDocumentScalarFieldEnum[];
};
/**
 * PdfDocument create
 */
export type PdfDocumentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PdfDocument
     */
    select?: Prisma.PdfDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PdfDocument
     */
    omit?: Prisma.PdfDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PdfDocumentInclude<ExtArgs> | null;
    /**
     * The data needed to create a PdfDocument.
     */
    data: Prisma.XOR<Prisma.PdfDocumentCreateInput, Prisma.PdfDocumentUncheckedCreateInput>;
};
/**
 * PdfDocument createMany
 */
export type PdfDocumentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many PdfDocuments.
     */
    data: Prisma.PdfDocumentCreateManyInput | Prisma.PdfDocumentCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * PdfDocument createManyAndReturn
 */
export type PdfDocumentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PdfDocument
     */
    select?: Prisma.PdfDocumentSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the PdfDocument
     */
    omit?: Prisma.PdfDocumentOmit<ExtArgs> | null;
    /**
     * The data used to create many PdfDocuments.
     */
    data: Prisma.PdfDocumentCreateManyInput | Prisma.PdfDocumentCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PdfDocumentIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * PdfDocument update
 */
export type PdfDocumentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PdfDocument
     */
    select?: Prisma.PdfDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PdfDocument
     */
    omit?: Prisma.PdfDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PdfDocumentInclude<ExtArgs> | null;
    /**
     * The data needed to update a PdfDocument.
     */
    data: Prisma.XOR<Prisma.PdfDocumentUpdateInput, Prisma.PdfDocumentUncheckedUpdateInput>;
    /**
     * Choose, which PdfDocument to update.
     */
    where: Prisma.PdfDocumentWhereUniqueInput;
};
/**
 * PdfDocument updateMany
 */
export type PdfDocumentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update PdfDocuments.
     */
    data: Prisma.XOR<Prisma.PdfDocumentUpdateManyMutationInput, Prisma.PdfDocumentUncheckedUpdateManyInput>;
    /**
     * Filter which PdfDocuments to update
     */
    where?: Prisma.PdfDocumentWhereInput;
    /**
     * Limit how many PdfDocuments to update.
     */
    limit?: number;
};
/**
 * PdfDocument updateManyAndReturn
 */
export type PdfDocumentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PdfDocument
     */
    select?: Prisma.PdfDocumentSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the PdfDocument
     */
    omit?: Prisma.PdfDocumentOmit<ExtArgs> | null;
    /**
     * The data used to update PdfDocuments.
     */
    data: Prisma.XOR<Prisma.PdfDocumentUpdateManyMutationInput, Prisma.PdfDocumentUncheckedUpdateManyInput>;
    /**
     * Filter which PdfDocuments to update
     */
    where?: Prisma.PdfDocumentWhereInput;
    /**
     * Limit how many PdfDocuments to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PdfDocumentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * PdfDocument upsert
 */
export type PdfDocumentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PdfDocument
     */
    select?: Prisma.PdfDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PdfDocument
     */
    omit?: Prisma.PdfDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PdfDocumentInclude<ExtArgs> | null;
    /**
     * The filter to search for the PdfDocument to update in case it exists.
     */
    where: Prisma.PdfDocumentWhereUniqueInput;
    /**
     * In case the PdfDocument found by the `where` argument doesn't exist, create a new PdfDocument with this data.
     */
    create: Prisma.XOR<Prisma.PdfDocumentCreateInput, Prisma.PdfDocumentUncheckedCreateInput>;
    /**
     * In case the PdfDocument was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.PdfDocumentUpdateInput, Prisma.PdfDocumentUncheckedUpdateInput>;
};
/**
 * PdfDocument delete
 */
export type PdfDocumentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PdfDocument
     */
    select?: Prisma.PdfDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PdfDocument
     */
    omit?: Prisma.PdfDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PdfDocumentInclude<ExtArgs> | null;
    /**
     * Filter which PdfDocument to delete.
     */
    where: Prisma.PdfDocumentWhereUniqueInput;
};
/**
 * PdfDocument deleteMany
 */
export type PdfDocumentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which PdfDocuments to delete
     */
    where?: Prisma.PdfDocumentWhereInput;
    /**
     * Limit how many PdfDocuments to delete.
     */
    limit?: number;
};
/**
 * PdfDocument.transaction
 */
export type PdfDocument$transactionArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: Prisma.TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: Prisma.TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TransactionInclude<ExtArgs> | null;
    where?: Prisma.TransactionWhereInput;
};
/**
 * PdfDocument without action
 */
export type PdfDocumentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PdfDocument
     */
    select?: Prisma.PdfDocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PdfDocument
     */
    omit?: Prisma.PdfDocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PdfDocumentInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=PdfDocument.d.ts.map