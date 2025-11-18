import type * as runtime from "@prisma/client/runtime/library";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Document
 *
 */
export type DocumentModel = runtime.Types.Result.DefaultSelection<Prisma.$DocumentPayload>;
export type AggregateDocument = {
    _count: DocumentCountAggregateOutputType | null;
    _avg: DocumentAvgAggregateOutputType | null;
    _sum: DocumentSumAggregateOutputType | null;
    _min: DocumentMinAggregateOutputType | null;
    _max: DocumentMaxAggregateOutputType | null;
};
export type DocumentAvgAggregateOutputType = {
    file_size: number | null;
    confidence_score: number | null;
    processing_duration: number | null;
    page_count: number | null;
    data_quality_score: number | null;
};
export type DocumentSumAggregateOutputType = {
    file_size: bigint | null;
    confidence_score: number | null;
    processing_duration: number | null;
    page_count: number | null;
    data_quality_score: number | null;
};
export type DocumentMinAggregateOutputType = {
    id: string | null;
    user_id: string | null;
    filename: string | null;
    original_filename: string | null;
    file_path: string | null;
    file_size: bigint | null;
    mime_type: string | null;
    upload_source: string | null;
    parsing_status: $Enums.ParsingStatus | null;
    parsing_error: string | null;
    extracted_text: string | null;
    document_type: string | null;
    document_category: string | null;
    confidence_score: number | null;
    gap_detection_status: $Enums.GapDetectionStatus | null;
    auto_fill_status: $Enums.AutoFillStatus | null;
    processing_method: $Enums.ProcessingMethod | null;
    processing_duration: number | null;
    ai_model_used: string | null;
    page_count: number | null;
    is_password_protected: boolean | null;
    password: string | null;
    data_quality_score: number | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type DocumentMaxAggregateOutputType = {
    id: string | null;
    user_id: string | null;
    filename: string | null;
    original_filename: string | null;
    file_path: string | null;
    file_size: bigint | null;
    mime_type: string | null;
    upload_source: string | null;
    parsing_status: $Enums.ParsingStatus | null;
    parsing_error: string | null;
    extracted_text: string | null;
    document_type: string | null;
    document_category: string | null;
    confidence_score: number | null;
    gap_detection_status: $Enums.GapDetectionStatus | null;
    auto_fill_status: $Enums.AutoFillStatus | null;
    processing_method: $Enums.ProcessingMethod | null;
    processing_duration: number | null;
    ai_model_used: string | null;
    page_count: number | null;
    is_password_protected: boolean | null;
    password: string | null;
    data_quality_score: number | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type DocumentCountAggregateOutputType = {
    id: number;
    user_id: number;
    filename: number;
    original_filename: number;
    file_path: number;
    file_size: number;
    mime_type: number;
    upload_source: number;
    parsing_status: number;
    parsing_error: number;
    extracted_text: number;
    document_type: number;
    document_category: number;
    confidence_score: number;
    extracted_data: number;
    gap_detection_status: number;
    detected_gaps: number;
    auto_fill_attempts: number;
    auto_fill_status: number;
    processing_method: number;
    processing_duration: number;
    ai_model_used: number;
    page_count: number;
    is_password_protected: number;
    password: number;
    data_quality_score: number;
    validation_errors: number;
    created_at: number;
    updated_at: number;
    _all: number;
};
export type DocumentAvgAggregateInputType = {
    file_size?: true;
    confidence_score?: true;
    processing_duration?: true;
    page_count?: true;
    data_quality_score?: true;
};
export type DocumentSumAggregateInputType = {
    file_size?: true;
    confidence_score?: true;
    processing_duration?: true;
    page_count?: true;
    data_quality_score?: true;
};
export type DocumentMinAggregateInputType = {
    id?: true;
    user_id?: true;
    filename?: true;
    original_filename?: true;
    file_path?: true;
    file_size?: true;
    mime_type?: true;
    upload_source?: true;
    parsing_status?: true;
    parsing_error?: true;
    extracted_text?: true;
    document_type?: true;
    document_category?: true;
    confidence_score?: true;
    gap_detection_status?: true;
    auto_fill_status?: true;
    processing_method?: true;
    processing_duration?: true;
    ai_model_used?: true;
    page_count?: true;
    is_password_protected?: true;
    password?: true;
    data_quality_score?: true;
    created_at?: true;
    updated_at?: true;
};
export type DocumentMaxAggregateInputType = {
    id?: true;
    user_id?: true;
    filename?: true;
    original_filename?: true;
    file_path?: true;
    file_size?: true;
    mime_type?: true;
    upload_source?: true;
    parsing_status?: true;
    parsing_error?: true;
    extracted_text?: true;
    document_type?: true;
    document_category?: true;
    confidence_score?: true;
    gap_detection_status?: true;
    auto_fill_status?: true;
    processing_method?: true;
    processing_duration?: true;
    ai_model_used?: true;
    page_count?: true;
    is_password_protected?: true;
    password?: true;
    data_quality_score?: true;
    created_at?: true;
    updated_at?: true;
};
export type DocumentCountAggregateInputType = {
    id?: true;
    user_id?: true;
    filename?: true;
    original_filename?: true;
    file_path?: true;
    file_size?: true;
    mime_type?: true;
    upload_source?: true;
    parsing_status?: true;
    parsing_error?: true;
    extracted_text?: true;
    document_type?: true;
    document_category?: true;
    confidence_score?: true;
    extracted_data?: true;
    gap_detection_status?: true;
    detected_gaps?: true;
    auto_fill_attempts?: true;
    auto_fill_status?: true;
    processing_method?: true;
    processing_duration?: true;
    ai_model_used?: true;
    page_count?: true;
    is_password_protected?: true;
    password?: true;
    data_quality_score?: true;
    validation_errors?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
};
export type DocumentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Document to aggregate.
     */
    where?: Prisma.DocumentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Documents to fetch.
     */
    orderBy?: Prisma.DocumentOrderByWithRelationInput | Prisma.DocumentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.DocumentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Documents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Documents
    **/
    _count?: true | DocumentCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: DocumentAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: DocumentSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: DocumentMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: DocumentMaxAggregateInputType;
};
export type GetDocumentAggregateType<T extends DocumentAggregateArgs> = {
    [P in keyof T & keyof AggregateDocument]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDocument[P]> : Prisma.GetScalarType<T[P], AggregateDocument[P]>;
};
export type DocumentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocumentWhereInput;
    orderBy?: Prisma.DocumentOrderByWithAggregationInput | Prisma.DocumentOrderByWithAggregationInput[];
    by: Prisma.DocumentScalarFieldEnum[] | Prisma.DocumentScalarFieldEnum;
    having?: Prisma.DocumentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DocumentCountAggregateInputType | true;
    _avg?: DocumentAvgAggregateInputType;
    _sum?: DocumentSumAggregateInputType;
    _min?: DocumentMinAggregateInputType;
    _max?: DocumentMaxAggregateInputType;
};
export type DocumentGroupByOutputType = {
    id: string;
    user_id: string;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: bigint;
    mime_type: string;
    upload_source: string | null;
    parsing_status: $Enums.ParsingStatus;
    parsing_error: string | null;
    extracted_text: string | null;
    document_type: string | null;
    document_category: string | null;
    confidence_score: number | null;
    extracted_data: runtime.JsonValue | null;
    gap_detection_status: $Enums.GapDetectionStatus;
    detected_gaps: runtime.JsonValue | null;
    auto_fill_attempts: runtime.JsonValue | null;
    auto_fill_status: $Enums.AutoFillStatus;
    processing_method: $Enums.ProcessingMethod | null;
    processing_duration: number | null;
    ai_model_used: string | null;
    page_count: number | null;
    is_password_protected: boolean;
    password: string | null;
    data_quality_score: number | null;
    validation_errors: runtime.JsonValue | null;
    created_at: Date;
    updated_at: Date;
    _count: DocumentCountAggregateOutputType | null;
    _avg: DocumentAvgAggregateOutputType | null;
    _sum: DocumentSumAggregateOutputType | null;
    _min: DocumentMinAggregateOutputType | null;
    _max: DocumentMaxAggregateOutputType | null;
};
type GetDocumentGroupByPayload<T extends DocumentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DocumentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DocumentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DocumentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DocumentGroupByOutputType[P]>;
}>>;
export type DocumentWhereInput = {
    AND?: Prisma.DocumentWhereInput | Prisma.DocumentWhereInput[];
    OR?: Prisma.DocumentWhereInput[];
    NOT?: Prisma.DocumentWhereInput | Prisma.DocumentWhereInput[];
    id?: Prisma.UuidFilter<"Document"> | string;
    user_id?: Prisma.UuidFilter<"Document"> | string;
    filename?: Prisma.StringFilter<"Document"> | string;
    original_filename?: Prisma.StringFilter<"Document"> | string;
    file_path?: Prisma.StringFilter<"Document"> | string;
    file_size?: Prisma.BigIntFilter<"Document"> | bigint | number;
    mime_type?: Prisma.StringFilter<"Document"> | string;
    upload_source?: Prisma.StringNullableFilter<"Document"> | string | null;
    parsing_status?: Prisma.EnumParsingStatusFilter<"Document"> | $Enums.ParsingStatus;
    parsing_error?: Prisma.StringNullableFilter<"Document"> | string | null;
    extracted_text?: Prisma.StringNullableFilter<"Document"> | string | null;
    document_type?: Prisma.StringNullableFilter<"Document"> | string | null;
    document_category?: Prisma.StringNullableFilter<"Document"> | string | null;
    confidence_score?: Prisma.FloatNullableFilter<"Document"> | number | null;
    extracted_data?: Prisma.JsonNullableFilter<"Document">;
    gap_detection_status?: Prisma.EnumGapDetectionStatusFilter<"Document"> | $Enums.GapDetectionStatus;
    detected_gaps?: Prisma.JsonNullableFilter<"Document">;
    auto_fill_attempts?: Prisma.JsonNullableFilter<"Document">;
    auto_fill_status?: Prisma.EnumAutoFillStatusFilter<"Document"> | $Enums.AutoFillStatus;
    processing_method?: Prisma.EnumProcessingMethodNullableFilter<"Document"> | $Enums.ProcessingMethod | null;
    processing_duration?: Prisma.IntNullableFilter<"Document"> | number | null;
    ai_model_used?: Prisma.StringNullableFilter<"Document"> | string | null;
    page_count?: Prisma.IntNullableFilter<"Document"> | number | null;
    is_password_protected?: Prisma.BoolFilter<"Document"> | boolean;
    password?: Prisma.StringNullableFilter<"Document"> | string | null;
    data_quality_score?: Prisma.FloatNullableFilter<"Document"> | number | null;
    validation_errors?: Prisma.JsonNullableFilter<"Document">;
    created_at?: Prisma.DateTimeFilter<"Document"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Document"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type DocumentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    filename?: Prisma.SortOrder;
    original_filename?: Prisma.SortOrder;
    file_path?: Prisma.SortOrder;
    file_size?: Prisma.SortOrder;
    mime_type?: Prisma.SortOrder;
    upload_source?: Prisma.SortOrderInput | Prisma.SortOrder;
    parsing_status?: Prisma.SortOrder;
    parsing_error?: Prisma.SortOrderInput | Prisma.SortOrder;
    extracted_text?: Prisma.SortOrderInput | Prisma.SortOrder;
    document_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    document_category?: Prisma.SortOrderInput | Prisma.SortOrder;
    confidence_score?: Prisma.SortOrderInput | Prisma.SortOrder;
    extracted_data?: Prisma.SortOrderInput | Prisma.SortOrder;
    gap_detection_status?: Prisma.SortOrder;
    detected_gaps?: Prisma.SortOrderInput | Prisma.SortOrder;
    auto_fill_attempts?: Prisma.SortOrderInput | Prisma.SortOrder;
    auto_fill_status?: Prisma.SortOrder;
    processing_method?: Prisma.SortOrderInput | Prisma.SortOrder;
    processing_duration?: Prisma.SortOrderInput | Prisma.SortOrder;
    ai_model_used?: Prisma.SortOrderInput | Prisma.SortOrder;
    page_count?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_password_protected?: Prisma.SortOrder;
    password?: Prisma.SortOrderInput | Prisma.SortOrder;
    data_quality_score?: Prisma.SortOrderInput | Prisma.SortOrder;
    validation_errors?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type DocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.DocumentWhereInput | Prisma.DocumentWhereInput[];
    OR?: Prisma.DocumentWhereInput[];
    NOT?: Prisma.DocumentWhereInput | Prisma.DocumentWhereInput[];
    user_id?: Prisma.UuidFilter<"Document"> | string;
    filename?: Prisma.StringFilter<"Document"> | string;
    original_filename?: Prisma.StringFilter<"Document"> | string;
    file_path?: Prisma.StringFilter<"Document"> | string;
    file_size?: Prisma.BigIntFilter<"Document"> | bigint | number;
    mime_type?: Prisma.StringFilter<"Document"> | string;
    upload_source?: Prisma.StringNullableFilter<"Document"> | string | null;
    parsing_status?: Prisma.EnumParsingStatusFilter<"Document"> | $Enums.ParsingStatus;
    parsing_error?: Prisma.StringNullableFilter<"Document"> | string | null;
    extracted_text?: Prisma.StringNullableFilter<"Document"> | string | null;
    document_type?: Prisma.StringNullableFilter<"Document"> | string | null;
    document_category?: Prisma.StringNullableFilter<"Document"> | string | null;
    confidence_score?: Prisma.FloatNullableFilter<"Document"> | number | null;
    extracted_data?: Prisma.JsonNullableFilter<"Document">;
    gap_detection_status?: Prisma.EnumGapDetectionStatusFilter<"Document"> | $Enums.GapDetectionStatus;
    detected_gaps?: Prisma.JsonNullableFilter<"Document">;
    auto_fill_attempts?: Prisma.JsonNullableFilter<"Document">;
    auto_fill_status?: Prisma.EnumAutoFillStatusFilter<"Document"> | $Enums.AutoFillStatus;
    processing_method?: Prisma.EnumProcessingMethodNullableFilter<"Document"> | $Enums.ProcessingMethod | null;
    processing_duration?: Prisma.IntNullableFilter<"Document"> | number | null;
    ai_model_used?: Prisma.StringNullableFilter<"Document"> | string | null;
    page_count?: Prisma.IntNullableFilter<"Document"> | number | null;
    is_password_protected?: Prisma.BoolFilter<"Document"> | boolean;
    password?: Prisma.StringNullableFilter<"Document"> | string | null;
    data_quality_score?: Prisma.FloatNullableFilter<"Document"> | number | null;
    validation_errors?: Prisma.JsonNullableFilter<"Document">;
    created_at?: Prisma.DateTimeFilter<"Document"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Document"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type DocumentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    filename?: Prisma.SortOrder;
    original_filename?: Prisma.SortOrder;
    file_path?: Prisma.SortOrder;
    file_size?: Prisma.SortOrder;
    mime_type?: Prisma.SortOrder;
    upload_source?: Prisma.SortOrderInput | Prisma.SortOrder;
    parsing_status?: Prisma.SortOrder;
    parsing_error?: Prisma.SortOrderInput | Prisma.SortOrder;
    extracted_text?: Prisma.SortOrderInput | Prisma.SortOrder;
    document_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    document_category?: Prisma.SortOrderInput | Prisma.SortOrder;
    confidence_score?: Prisma.SortOrderInput | Prisma.SortOrder;
    extracted_data?: Prisma.SortOrderInput | Prisma.SortOrder;
    gap_detection_status?: Prisma.SortOrder;
    detected_gaps?: Prisma.SortOrderInput | Prisma.SortOrder;
    auto_fill_attempts?: Prisma.SortOrderInput | Prisma.SortOrder;
    auto_fill_status?: Prisma.SortOrder;
    processing_method?: Prisma.SortOrderInput | Prisma.SortOrder;
    processing_duration?: Prisma.SortOrderInput | Prisma.SortOrder;
    ai_model_used?: Prisma.SortOrderInput | Prisma.SortOrder;
    page_count?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_password_protected?: Prisma.SortOrder;
    password?: Prisma.SortOrderInput | Prisma.SortOrder;
    data_quality_score?: Prisma.SortOrderInput | Prisma.SortOrder;
    validation_errors?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    _count?: Prisma.DocumentCountOrderByAggregateInput;
    _avg?: Prisma.DocumentAvgOrderByAggregateInput;
    _max?: Prisma.DocumentMaxOrderByAggregateInput;
    _min?: Prisma.DocumentMinOrderByAggregateInput;
    _sum?: Prisma.DocumentSumOrderByAggregateInput;
};
export type DocumentScalarWhereWithAggregatesInput = {
    AND?: Prisma.DocumentScalarWhereWithAggregatesInput | Prisma.DocumentScalarWhereWithAggregatesInput[];
    OR?: Prisma.DocumentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DocumentScalarWhereWithAggregatesInput | Prisma.DocumentScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Document"> | string;
    user_id?: Prisma.UuidWithAggregatesFilter<"Document"> | string;
    filename?: Prisma.StringWithAggregatesFilter<"Document"> | string;
    original_filename?: Prisma.StringWithAggregatesFilter<"Document"> | string;
    file_path?: Prisma.StringWithAggregatesFilter<"Document"> | string;
    file_size?: Prisma.BigIntWithAggregatesFilter<"Document"> | bigint | number;
    mime_type?: Prisma.StringWithAggregatesFilter<"Document"> | string;
    upload_source?: Prisma.StringNullableWithAggregatesFilter<"Document"> | string | null;
    parsing_status?: Prisma.EnumParsingStatusWithAggregatesFilter<"Document"> | $Enums.ParsingStatus;
    parsing_error?: Prisma.StringNullableWithAggregatesFilter<"Document"> | string | null;
    extracted_text?: Prisma.StringNullableWithAggregatesFilter<"Document"> | string | null;
    document_type?: Prisma.StringNullableWithAggregatesFilter<"Document"> | string | null;
    document_category?: Prisma.StringNullableWithAggregatesFilter<"Document"> | string | null;
    confidence_score?: Prisma.FloatNullableWithAggregatesFilter<"Document"> | number | null;
    extracted_data?: Prisma.JsonNullableWithAggregatesFilter<"Document">;
    gap_detection_status?: Prisma.EnumGapDetectionStatusWithAggregatesFilter<"Document"> | $Enums.GapDetectionStatus;
    detected_gaps?: Prisma.JsonNullableWithAggregatesFilter<"Document">;
    auto_fill_attempts?: Prisma.JsonNullableWithAggregatesFilter<"Document">;
    auto_fill_status?: Prisma.EnumAutoFillStatusWithAggregatesFilter<"Document"> | $Enums.AutoFillStatus;
    processing_method?: Prisma.EnumProcessingMethodNullableWithAggregatesFilter<"Document"> | $Enums.ProcessingMethod | null;
    processing_duration?: Prisma.IntNullableWithAggregatesFilter<"Document"> | number | null;
    ai_model_used?: Prisma.StringNullableWithAggregatesFilter<"Document"> | string | null;
    page_count?: Prisma.IntNullableWithAggregatesFilter<"Document"> | number | null;
    is_password_protected?: Prisma.BoolWithAggregatesFilter<"Document"> | boolean;
    password?: Prisma.StringNullableWithAggregatesFilter<"Document"> | string | null;
    data_quality_score?: Prisma.FloatNullableWithAggregatesFilter<"Document"> | number | null;
    validation_errors?: Prisma.JsonNullableWithAggregatesFilter<"Document">;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"Document"> | Date | string;
    updated_at?: Prisma.DateTimeWithAggregatesFilter<"Document"> | Date | string;
};
export type DocumentCreateInput = {
    id?: string;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: bigint | number;
    mime_type?: string;
    upload_source?: string | null;
    parsing_status?: $Enums.ParsingStatus;
    parsing_error?: string | null;
    extracted_text?: string | null;
    document_type?: string | null;
    document_category?: string | null;
    confidence_score?: number | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    gap_detection_status?: $Enums.GapDetectionStatus;
    detected_gaps?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_attempts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_status?: $Enums.AutoFillStatus;
    processing_method?: $Enums.ProcessingMethod | null;
    processing_duration?: number | null;
    ai_model_used?: string | null;
    page_count?: number | null;
    is_password_protected?: boolean;
    password?: string | null;
    data_quality_score?: number | null;
    validation_errors?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string;
    updated_at?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutDocumentsInput;
};
export type DocumentUncheckedCreateInput = {
    id?: string;
    user_id: string;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: bigint | number;
    mime_type?: string;
    upload_source?: string | null;
    parsing_status?: $Enums.ParsingStatus;
    parsing_error?: string | null;
    extracted_text?: string | null;
    document_type?: string | null;
    document_category?: string | null;
    confidence_score?: number | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    gap_detection_status?: $Enums.GapDetectionStatus;
    detected_gaps?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_attempts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_status?: $Enums.AutoFillStatus;
    processing_method?: $Enums.ProcessingMethod | null;
    processing_duration?: number | null;
    ai_model_used?: string | null;
    page_count?: number | null;
    is_password_protected?: boolean;
    password?: string | null;
    data_quality_score?: number | null;
    validation_errors?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type DocumentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    original_filename?: Prisma.StringFieldUpdateOperationsInput | string;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    file_size?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    mime_type?: Prisma.StringFieldUpdateOperationsInput | string;
    upload_source?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parsing_status?: Prisma.EnumParsingStatusFieldUpdateOperationsInput | $Enums.ParsingStatus;
    parsing_error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    confidence_score?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    gap_detection_status?: Prisma.EnumGapDetectionStatusFieldUpdateOperationsInput | $Enums.GapDetectionStatus;
    detected_gaps?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_attempts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_status?: Prisma.EnumAutoFillStatusFieldUpdateOperationsInput | $Enums.AutoFillStatus;
    processing_method?: Prisma.NullableEnumProcessingMethodFieldUpdateOperationsInput | $Enums.ProcessingMethod | null;
    processing_duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    ai_model_used?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    page_count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_password_protected?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    data_quality_score?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    validation_errors?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutDocumentsNestedInput;
};
export type DocumentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    original_filename?: Prisma.StringFieldUpdateOperationsInput | string;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    file_size?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    mime_type?: Prisma.StringFieldUpdateOperationsInput | string;
    upload_source?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parsing_status?: Prisma.EnumParsingStatusFieldUpdateOperationsInput | $Enums.ParsingStatus;
    parsing_error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    confidence_score?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    gap_detection_status?: Prisma.EnumGapDetectionStatusFieldUpdateOperationsInput | $Enums.GapDetectionStatus;
    detected_gaps?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_attempts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_status?: Prisma.EnumAutoFillStatusFieldUpdateOperationsInput | $Enums.AutoFillStatus;
    processing_method?: Prisma.NullableEnumProcessingMethodFieldUpdateOperationsInput | $Enums.ProcessingMethod | null;
    processing_duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    ai_model_used?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    page_count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_password_protected?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    data_quality_score?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    validation_errors?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocumentCreateManyInput = {
    id?: string;
    user_id: string;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: bigint | number;
    mime_type?: string;
    upload_source?: string | null;
    parsing_status?: $Enums.ParsingStatus;
    parsing_error?: string | null;
    extracted_text?: string | null;
    document_type?: string | null;
    document_category?: string | null;
    confidence_score?: number | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    gap_detection_status?: $Enums.GapDetectionStatus;
    detected_gaps?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_attempts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_status?: $Enums.AutoFillStatus;
    processing_method?: $Enums.ProcessingMethod | null;
    processing_duration?: number | null;
    ai_model_used?: string | null;
    page_count?: number | null;
    is_password_protected?: boolean;
    password?: string | null;
    data_quality_score?: number | null;
    validation_errors?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type DocumentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    original_filename?: Prisma.StringFieldUpdateOperationsInput | string;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    file_size?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    mime_type?: Prisma.StringFieldUpdateOperationsInput | string;
    upload_source?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parsing_status?: Prisma.EnumParsingStatusFieldUpdateOperationsInput | $Enums.ParsingStatus;
    parsing_error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    confidence_score?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    gap_detection_status?: Prisma.EnumGapDetectionStatusFieldUpdateOperationsInput | $Enums.GapDetectionStatus;
    detected_gaps?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_attempts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_status?: Prisma.EnumAutoFillStatusFieldUpdateOperationsInput | $Enums.AutoFillStatus;
    processing_method?: Prisma.NullableEnumProcessingMethodFieldUpdateOperationsInput | $Enums.ProcessingMethod | null;
    processing_duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    ai_model_used?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    page_count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_password_protected?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    data_quality_score?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    validation_errors?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocumentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    original_filename?: Prisma.StringFieldUpdateOperationsInput | string;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    file_size?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    mime_type?: Prisma.StringFieldUpdateOperationsInput | string;
    upload_source?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parsing_status?: Prisma.EnumParsingStatusFieldUpdateOperationsInput | $Enums.ParsingStatus;
    parsing_error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    confidence_score?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    gap_detection_status?: Prisma.EnumGapDetectionStatusFieldUpdateOperationsInput | $Enums.GapDetectionStatus;
    detected_gaps?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_attempts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_status?: Prisma.EnumAutoFillStatusFieldUpdateOperationsInput | $Enums.AutoFillStatus;
    processing_method?: Prisma.NullableEnumProcessingMethodFieldUpdateOperationsInput | $Enums.ProcessingMethod | null;
    processing_duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    ai_model_used?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    page_count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_password_protected?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    data_quality_score?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    validation_errors?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocumentListRelationFilter = {
    every?: Prisma.DocumentWhereInput;
    some?: Prisma.DocumentWhereInput;
    none?: Prisma.DocumentWhereInput;
};
export type DocumentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type DocumentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    filename?: Prisma.SortOrder;
    original_filename?: Prisma.SortOrder;
    file_path?: Prisma.SortOrder;
    file_size?: Prisma.SortOrder;
    mime_type?: Prisma.SortOrder;
    upload_source?: Prisma.SortOrder;
    parsing_status?: Prisma.SortOrder;
    parsing_error?: Prisma.SortOrder;
    extracted_text?: Prisma.SortOrder;
    document_type?: Prisma.SortOrder;
    document_category?: Prisma.SortOrder;
    confidence_score?: Prisma.SortOrder;
    extracted_data?: Prisma.SortOrder;
    gap_detection_status?: Prisma.SortOrder;
    detected_gaps?: Prisma.SortOrder;
    auto_fill_attempts?: Prisma.SortOrder;
    auto_fill_status?: Prisma.SortOrder;
    processing_method?: Prisma.SortOrder;
    processing_duration?: Prisma.SortOrder;
    ai_model_used?: Prisma.SortOrder;
    page_count?: Prisma.SortOrder;
    is_password_protected?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    data_quality_score?: Prisma.SortOrder;
    validation_errors?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type DocumentAvgOrderByAggregateInput = {
    file_size?: Prisma.SortOrder;
    confidence_score?: Prisma.SortOrder;
    processing_duration?: Prisma.SortOrder;
    page_count?: Prisma.SortOrder;
    data_quality_score?: Prisma.SortOrder;
};
export type DocumentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    filename?: Prisma.SortOrder;
    original_filename?: Prisma.SortOrder;
    file_path?: Prisma.SortOrder;
    file_size?: Prisma.SortOrder;
    mime_type?: Prisma.SortOrder;
    upload_source?: Prisma.SortOrder;
    parsing_status?: Prisma.SortOrder;
    parsing_error?: Prisma.SortOrder;
    extracted_text?: Prisma.SortOrder;
    document_type?: Prisma.SortOrder;
    document_category?: Prisma.SortOrder;
    confidence_score?: Prisma.SortOrder;
    gap_detection_status?: Prisma.SortOrder;
    auto_fill_status?: Prisma.SortOrder;
    processing_method?: Prisma.SortOrder;
    processing_duration?: Prisma.SortOrder;
    ai_model_used?: Prisma.SortOrder;
    page_count?: Prisma.SortOrder;
    is_password_protected?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    data_quality_score?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type DocumentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    filename?: Prisma.SortOrder;
    original_filename?: Prisma.SortOrder;
    file_path?: Prisma.SortOrder;
    file_size?: Prisma.SortOrder;
    mime_type?: Prisma.SortOrder;
    upload_source?: Prisma.SortOrder;
    parsing_status?: Prisma.SortOrder;
    parsing_error?: Prisma.SortOrder;
    extracted_text?: Prisma.SortOrder;
    document_type?: Prisma.SortOrder;
    document_category?: Prisma.SortOrder;
    confidence_score?: Prisma.SortOrder;
    gap_detection_status?: Prisma.SortOrder;
    auto_fill_status?: Prisma.SortOrder;
    processing_method?: Prisma.SortOrder;
    processing_duration?: Prisma.SortOrder;
    ai_model_used?: Prisma.SortOrder;
    page_count?: Prisma.SortOrder;
    is_password_protected?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    data_quality_score?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type DocumentSumOrderByAggregateInput = {
    file_size?: Prisma.SortOrder;
    confidence_score?: Prisma.SortOrder;
    processing_duration?: Prisma.SortOrder;
    page_count?: Prisma.SortOrder;
    data_quality_score?: Prisma.SortOrder;
};
export type DocumentCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.DocumentCreateWithoutUserInput, Prisma.DocumentUncheckedCreateWithoutUserInput> | Prisma.DocumentCreateWithoutUserInput[] | Prisma.DocumentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.DocumentCreateOrConnectWithoutUserInput | Prisma.DocumentCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.DocumentCreateManyUserInputEnvelope;
    connect?: Prisma.DocumentWhereUniqueInput | Prisma.DocumentWhereUniqueInput[];
};
export type DocumentUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.DocumentCreateWithoutUserInput, Prisma.DocumentUncheckedCreateWithoutUserInput> | Prisma.DocumentCreateWithoutUserInput[] | Prisma.DocumentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.DocumentCreateOrConnectWithoutUserInput | Prisma.DocumentCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.DocumentCreateManyUserInputEnvelope;
    connect?: Prisma.DocumentWhereUniqueInput | Prisma.DocumentWhereUniqueInput[];
};
export type DocumentUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.DocumentCreateWithoutUserInput, Prisma.DocumentUncheckedCreateWithoutUserInput> | Prisma.DocumentCreateWithoutUserInput[] | Prisma.DocumentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.DocumentCreateOrConnectWithoutUserInput | Prisma.DocumentCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.DocumentUpsertWithWhereUniqueWithoutUserInput | Prisma.DocumentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.DocumentCreateManyUserInputEnvelope;
    set?: Prisma.DocumentWhereUniqueInput | Prisma.DocumentWhereUniqueInput[];
    disconnect?: Prisma.DocumentWhereUniqueInput | Prisma.DocumentWhereUniqueInput[];
    delete?: Prisma.DocumentWhereUniqueInput | Prisma.DocumentWhereUniqueInput[];
    connect?: Prisma.DocumentWhereUniqueInput | Prisma.DocumentWhereUniqueInput[];
    update?: Prisma.DocumentUpdateWithWhereUniqueWithoutUserInput | Prisma.DocumentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.DocumentUpdateManyWithWhereWithoutUserInput | Prisma.DocumentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.DocumentScalarWhereInput | Prisma.DocumentScalarWhereInput[];
};
export type DocumentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.DocumentCreateWithoutUserInput, Prisma.DocumentUncheckedCreateWithoutUserInput> | Prisma.DocumentCreateWithoutUserInput[] | Prisma.DocumentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.DocumentCreateOrConnectWithoutUserInput | Prisma.DocumentCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.DocumentUpsertWithWhereUniqueWithoutUserInput | Prisma.DocumentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.DocumentCreateManyUserInputEnvelope;
    set?: Prisma.DocumentWhereUniqueInput | Prisma.DocumentWhereUniqueInput[];
    disconnect?: Prisma.DocumentWhereUniqueInput | Prisma.DocumentWhereUniqueInput[];
    delete?: Prisma.DocumentWhereUniqueInput | Prisma.DocumentWhereUniqueInput[];
    connect?: Prisma.DocumentWhereUniqueInput | Prisma.DocumentWhereUniqueInput[];
    update?: Prisma.DocumentUpdateWithWhereUniqueWithoutUserInput | Prisma.DocumentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.DocumentUpdateManyWithWhereWithoutUserInput | Prisma.DocumentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.DocumentScalarWhereInput | Prisma.DocumentScalarWhereInput[];
};
export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type EnumGapDetectionStatusFieldUpdateOperationsInput = {
    set?: $Enums.GapDetectionStatus;
};
export type EnumAutoFillStatusFieldUpdateOperationsInput = {
    set?: $Enums.AutoFillStatus;
};
export type NullableEnumProcessingMethodFieldUpdateOperationsInput = {
    set?: $Enums.ProcessingMethod | null;
};
export type DocumentCreateWithoutUserInput = {
    id?: string;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: bigint | number;
    mime_type?: string;
    upload_source?: string | null;
    parsing_status?: $Enums.ParsingStatus;
    parsing_error?: string | null;
    extracted_text?: string | null;
    document_type?: string | null;
    document_category?: string | null;
    confidence_score?: number | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    gap_detection_status?: $Enums.GapDetectionStatus;
    detected_gaps?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_attempts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_status?: $Enums.AutoFillStatus;
    processing_method?: $Enums.ProcessingMethod | null;
    processing_duration?: number | null;
    ai_model_used?: string | null;
    page_count?: number | null;
    is_password_protected?: boolean;
    password?: string | null;
    data_quality_score?: number | null;
    validation_errors?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type DocumentUncheckedCreateWithoutUserInput = {
    id?: string;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: bigint | number;
    mime_type?: string;
    upload_source?: string | null;
    parsing_status?: $Enums.ParsingStatus;
    parsing_error?: string | null;
    extracted_text?: string | null;
    document_type?: string | null;
    document_category?: string | null;
    confidence_score?: number | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    gap_detection_status?: $Enums.GapDetectionStatus;
    detected_gaps?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_attempts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_status?: $Enums.AutoFillStatus;
    processing_method?: $Enums.ProcessingMethod | null;
    processing_duration?: number | null;
    ai_model_used?: string | null;
    page_count?: number | null;
    is_password_protected?: boolean;
    password?: string | null;
    data_quality_score?: number | null;
    validation_errors?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type DocumentCreateOrConnectWithoutUserInput = {
    where: Prisma.DocumentWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocumentCreateWithoutUserInput, Prisma.DocumentUncheckedCreateWithoutUserInput>;
};
export type DocumentCreateManyUserInputEnvelope = {
    data: Prisma.DocumentCreateManyUserInput | Prisma.DocumentCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type DocumentUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.DocumentWhereUniqueInput;
    update: Prisma.XOR<Prisma.DocumentUpdateWithoutUserInput, Prisma.DocumentUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.DocumentCreateWithoutUserInput, Prisma.DocumentUncheckedCreateWithoutUserInput>;
};
export type DocumentUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.DocumentWhereUniqueInput;
    data: Prisma.XOR<Prisma.DocumentUpdateWithoutUserInput, Prisma.DocumentUncheckedUpdateWithoutUserInput>;
};
export type DocumentUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.DocumentScalarWhereInput;
    data: Prisma.XOR<Prisma.DocumentUpdateManyMutationInput, Prisma.DocumentUncheckedUpdateManyWithoutUserInput>;
};
export type DocumentScalarWhereInput = {
    AND?: Prisma.DocumentScalarWhereInput | Prisma.DocumentScalarWhereInput[];
    OR?: Prisma.DocumentScalarWhereInput[];
    NOT?: Prisma.DocumentScalarWhereInput | Prisma.DocumentScalarWhereInput[];
    id?: Prisma.UuidFilter<"Document"> | string;
    user_id?: Prisma.UuidFilter<"Document"> | string;
    filename?: Prisma.StringFilter<"Document"> | string;
    original_filename?: Prisma.StringFilter<"Document"> | string;
    file_path?: Prisma.StringFilter<"Document"> | string;
    file_size?: Prisma.BigIntFilter<"Document"> | bigint | number;
    mime_type?: Prisma.StringFilter<"Document"> | string;
    upload_source?: Prisma.StringNullableFilter<"Document"> | string | null;
    parsing_status?: Prisma.EnumParsingStatusFilter<"Document"> | $Enums.ParsingStatus;
    parsing_error?: Prisma.StringNullableFilter<"Document"> | string | null;
    extracted_text?: Prisma.StringNullableFilter<"Document"> | string | null;
    document_type?: Prisma.StringNullableFilter<"Document"> | string | null;
    document_category?: Prisma.StringNullableFilter<"Document"> | string | null;
    confidence_score?: Prisma.FloatNullableFilter<"Document"> | number | null;
    extracted_data?: Prisma.JsonNullableFilter<"Document">;
    gap_detection_status?: Prisma.EnumGapDetectionStatusFilter<"Document"> | $Enums.GapDetectionStatus;
    detected_gaps?: Prisma.JsonNullableFilter<"Document">;
    auto_fill_attempts?: Prisma.JsonNullableFilter<"Document">;
    auto_fill_status?: Prisma.EnumAutoFillStatusFilter<"Document"> | $Enums.AutoFillStatus;
    processing_method?: Prisma.EnumProcessingMethodNullableFilter<"Document"> | $Enums.ProcessingMethod | null;
    processing_duration?: Prisma.IntNullableFilter<"Document"> | number | null;
    ai_model_used?: Prisma.StringNullableFilter<"Document"> | string | null;
    page_count?: Prisma.IntNullableFilter<"Document"> | number | null;
    is_password_protected?: Prisma.BoolFilter<"Document"> | boolean;
    password?: Prisma.StringNullableFilter<"Document"> | string | null;
    data_quality_score?: Prisma.FloatNullableFilter<"Document"> | number | null;
    validation_errors?: Prisma.JsonNullableFilter<"Document">;
    created_at?: Prisma.DateTimeFilter<"Document"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Document"> | Date | string;
};
export type DocumentCreateManyUserInput = {
    id?: string;
    filename: string;
    original_filename: string;
    file_path: string;
    file_size: bigint | number;
    mime_type?: string;
    upload_source?: string | null;
    parsing_status?: $Enums.ParsingStatus;
    parsing_error?: string | null;
    extracted_text?: string | null;
    document_type?: string | null;
    document_category?: string | null;
    confidence_score?: number | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    gap_detection_status?: $Enums.GapDetectionStatus;
    detected_gaps?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_attempts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_status?: $Enums.AutoFillStatus;
    processing_method?: $Enums.ProcessingMethod | null;
    processing_duration?: number | null;
    ai_model_used?: string | null;
    page_count?: number | null;
    is_password_protected?: boolean;
    password?: string | null;
    data_quality_score?: number | null;
    validation_errors?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type DocumentUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    original_filename?: Prisma.StringFieldUpdateOperationsInput | string;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    file_size?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    mime_type?: Prisma.StringFieldUpdateOperationsInput | string;
    upload_source?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parsing_status?: Prisma.EnumParsingStatusFieldUpdateOperationsInput | $Enums.ParsingStatus;
    parsing_error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    confidence_score?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    gap_detection_status?: Prisma.EnumGapDetectionStatusFieldUpdateOperationsInput | $Enums.GapDetectionStatus;
    detected_gaps?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_attempts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_status?: Prisma.EnumAutoFillStatusFieldUpdateOperationsInput | $Enums.AutoFillStatus;
    processing_method?: Prisma.NullableEnumProcessingMethodFieldUpdateOperationsInput | $Enums.ProcessingMethod | null;
    processing_duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    ai_model_used?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    page_count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_password_protected?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    data_quality_score?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    validation_errors?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocumentUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    original_filename?: Prisma.StringFieldUpdateOperationsInput | string;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    file_size?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    mime_type?: Prisma.StringFieldUpdateOperationsInput | string;
    upload_source?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parsing_status?: Prisma.EnumParsingStatusFieldUpdateOperationsInput | $Enums.ParsingStatus;
    parsing_error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    confidence_score?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    gap_detection_status?: Prisma.EnumGapDetectionStatusFieldUpdateOperationsInput | $Enums.GapDetectionStatus;
    detected_gaps?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_attempts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_status?: Prisma.EnumAutoFillStatusFieldUpdateOperationsInput | $Enums.AutoFillStatus;
    processing_method?: Prisma.NullableEnumProcessingMethodFieldUpdateOperationsInput | $Enums.ProcessingMethod | null;
    processing_duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    ai_model_used?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    page_count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_password_protected?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    data_quality_score?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    validation_errors?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocumentUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    filename?: Prisma.StringFieldUpdateOperationsInput | string;
    original_filename?: Prisma.StringFieldUpdateOperationsInput | string;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    file_size?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    mime_type?: Prisma.StringFieldUpdateOperationsInput | string;
    upload_source?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parsing_status?: Prisma.EnumParsingStatusFieldUpdateOperationsInput | $Enums.ParsingStatus;
    parsing_error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    extracted_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_category?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    confidence_score?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    extracted_data?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    gap_detection_status?: Prisma.EnumGapDetectionStatusFieldUpdateOperationsInput | $Enums.GapDetectionStatus;
    detected_gaps?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_attempts?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    auto_fill_status?: Prisma.EnumAutoFillStatusFieldUpdateOperationsInput | $Enums.AutoFillStatus;
    processing_method?: Prisma.NullableEnumProcessingMethodFieldUpdateOperationsInput | $Enums.ProcessingMethod | null;
    processing_duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    ai_model_used?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    page_count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_password_protected?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    data_quality_score?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    validation_errors?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocumentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    user_id?: boolean;
    filename?: boolean;
    original_filename?: boolean;
    file_path?: boolean;
    file_size?: boolean;
    mime_type?: boolean;
    upload_source?: boolean;
    parsing_status?: boolean;
    parsing_error?: boolean;
    extracted_text?: boolean;
    document_type?: boolean;
    document_category?: boolean;
    confidence_score?: boolean;
    extracted_data?: boolean;
    gap_detection_status?: boolean;
    detected_gaps?: boolean;
    auto_fill_attempts?: boolean;
    auto_fill_status?: boolean;
    processing_method?: boolean;
    processing_duration?: boolean;
    ai_model_used?: boolean;
    page_count?: boolean;
    is_password_protected?: boolean;
    password?: boolean;
    data_quality_score?: boolean;
    validation_errors?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["document"]>;
export type DocumentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    user_id?: boolean;
    filename?: boolean;
    original_filename?: boolean;
    file_path?: boolean;
    file_size?: boolean;
    mime_type?: boolean;
    upload_source?: boolean;
    parsing_status?: boolean;
    parsing_error?: boolean;
    extracted_text?: boolean;
    document_type?: boolean;
    document_category?: boolean;
    confidence_score?: boolean;
    extracted_data?: boolean;
    gap_detection_status?: boolean;
    detected_gaps?: boolean;
    auto_fill_attempts?: boolean;
    auto_fill_status?: boolean;
    processing_method?: boolean;
    processing_duration?: boolean;
    ai_model_used?: boolean;
    page_count?: boolean;
    is_password_protected?: boolean;
    password?: boolean;
    data_quality_score?: boolean;
    validation_errors?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["document"]>;
export type DocumentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    user_id?: boolean;
    filename?: boolean;
    original_filename?: boolean;
    file_path?: boolean;
    file_size?: boolean;
    mime_type?: boolean;
    upload_source?: boolean;
    parsing_status?: boolean;
    parsing_error?: boolean;
    extracted_text?: boolean;
    document_type?: boolean;
    document_category?: boolean;
    confidence_score?: boolean;
    extracted_data?: boolean;
    gap_detection_status?: boolean;
    detected_gaps?: boolean;
    auto_fill_attempts?: boolean;
    auto_fill_status?: boolean;
    processing_method?: boolean;
    processing_duration?: boolean;
    ai_model_used?: boolean;
    page_count?: boolean;
    is_password_protected?: boolean;
    password?: boolean;
    data_quality_score?: boolean;
    validation_errors?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["document"]>;
export type DocumentSelectScalar = {
    id?: boolean;
    user_id?: boolean;
    filename?: boolean;
    original_filename?: boolean;
    file_path?: boolean;
    file_size?: boolean;
    mime_type?: boolean;
    upload_source?: boolean;
    parsing_status?: boolean;
    parsing_error?: boolean;
    extracted_text?: boolean;
    document_type?: boolean;
    document_category?: boolean;
    confidence_score?: boolean;
    extracted_data?: boolean;
    gap_detection_status?: boolean;
    detected_gaps?: boolean;
    auto_fill_attempts?: boolean;
    auto_fill_status?: boolean;
    processing_method?: boolean;
    processing_duration?: boolean;
    ai_model_used?: boolean;
    page_count?: boolean;
    is_password_protected?: boolean;
    password?: boolean;
    data_quality_score?: boolean;
    validation_errors?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
};
export type DocumentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "user_id" | "filename" | "original_filename" | "file_path" | "file_size" | "mime_type" | "upload_source" | "parsing_status" | "parsing_error" | "extracted_text" | "document_type" | "document_category" | "confidence_score" | "extracted_data" | "gap_detection_status" | "detected_gaps" | "auto_fill_attempts" | "auto_fill_status" | "processing_method" | "processing_duration" | "ai_model_used" | "page_count" | "is_password_protected" | "password" | "data_quality_score" | "validation_errors" | "created_at" | "updated_at", ExtArgs["result"]["document"]>;
export type DocumentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type DocumentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type DocumentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $DocumentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Document";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        user_id: string;
        filename: string;
        original_filename: string;
        file_path: string;
        file_size: bigint;
        mime_type: string;
        upload_source: string | null;
        parsing_status: $Enums.ParsingStatus;
        parsing_error: string | null;
        extracted_text: string | null;
        document_type: string | null;
        document_category: string | null;
        confidence_score: number | null;
        extracted_data: runtime.JsonValue | null;
        gap_detection_status: $Enums.GapDetectionStatus;
        detected_gaps: runtime.JsonValue | null;
        auto_fill_attempts: runtime.JsonValue | null;
        auto_fill_status: $Enums.AutoFillStatus;
        processing_method: $Enums.ProcessingMethod | null;
        processing_duration: number | null;
        ai_model_used: string | null;
        page_count: number | null;
        is_password_protected: boolean;
        password: string | null;
        data_quality_score: number | null;
        validation_errors: runtime.JsonValue | null;
        created_at: Date;
        updated_at: Date;
    }, ExtArgs["result"]["document"]>;
    composites: {};
};
export type DocumentGetPayload<S extends boolean | null | undefined | DocumentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DocumentPayload, S>;
export type DocumentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DocumentCountAggregateInputType | true;
};
export interface DocumentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Document'];
        meta: {
            name: 'Document';
        };
    };
    /**
     * Find zero or one Document that matches the filter.
     * @param {DocumentFindUniqueArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentFindUniqueArgs>(args: Prisma.SelectSubset<T, DocumentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DocumentClient<runtime.Types.Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Document that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DocumentFindUniqueOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DocumentClient<runtime.Types.Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Document that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentFindFirstArgs>(args?: Prisma.SelectSubset<T, DocumentFindFirstArgs<ExtArgs>>): Prisma.Prisma__DocumentClient<runtime.Types.Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Document that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DocumentClient<runtime.Types.Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Documents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Documents
     * const documents = await prisma.document.findMany()
     *
     * // Get first 10 Documents
     * const documents = await prisma.document.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const documentWithIdOnly = await prisma.document.findMany({ select: { id: true } })
     *
     */
    findMany<T extends DocumentFindManyArgs>(args?: Prisma.SelectSubset<T, DocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Document.
     * @param {DocumentCreateArgs} args - Arguments to create a Document.
     * @example
     * // Create one Document
     * const Document = await prisma.document.create({
     *   data: {
     *     // ... data to create a Document
     *   }
     * })
     *
     */
    create<T extends DocumentCreateArgs>(args: Prisma.SelectSubset<T, DocumentCreateArgs<ExtArgs>>): Prisma.Prisma__DocumentClient<runtime.Types.Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Documents.
     * @param {DocumentCreateManyArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends DocumentCreateManyArgs>(args?: Prisma.SelectSubset<T, DocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Documents and returns the data saved in the database.
     * @param {DocumentCreateManyAndReturnArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends DocumentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Document.
     * @param {DocumentDeleteArgs} args - Arguments to delete one Document.
     * @example
     * // Delete one Document
     * const Document = await prisma.document.delete({
     *   where: {
     *     // ... filter to delete one Document
     *   }
     * })
     *
     */
    delete<T extends DocumentDeleteArgs>(args: Prisma.SelectSubset<T, DocumentDeleteArgs<ExtArgs>>): Prisma.Prisma__DocumentClient<runtime.Types.Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Document.
     * @param {DocumentUpdateArgs} args - Arguments to update one Document.
     * @example
     * // Update one Document
     * const document = await prisma.document.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends DocumentUpdateArgs>(args: Prisma.SelectSubset<T, DocumentUpdateArgs<ExtArgs>>): Prisma.Prisma__DocumentClient<runtime.Types.Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Documents.
     * @param {DocumentDeleteManyArgs} args - Arguments to filter Documents to delete.
     * @example
     * // Delete a few Documents
     * const { count } = await prisma.document.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends DocumentDeleteManyArgs>(args?: Prisma.SelectSubset<T, DocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends DocumentUpdateManyArgs>(args: Prisma.SelectSubset<T, DocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Documents and returns the data updated in the database.
     * @param {DocumentUpdateManyAndReturnArgs} args - Arguments to update many Documents.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.updateManyAndReturn({
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
    updateManyAndReturn<T extends DocumentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Document.
     * @param {DocumentUpsertArgs} args - Arguments to update or create a Document.
     * @example
     * // Update or create a Document
     * const document = await prisma.document.upsert({
     *   create: {
     *     // ... data to create a Document
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Document we want to update
     *   }
     * })
     */
    upsert<T extends DocumentUpsertArgs>(args: Prisma.SelectSubset<T, DocumentUpsertArgs<ExtArgs>>): Prisma.Prisma__DocumentClient<runtime.Types.Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentCountArgs} args - Arguments to filter Documents to count.
     * @example
     * // Count the number of Documents
     * const count = await prisma.document.count({
     *   where: {
     *     // ... the filter for the Documents we want to count
     *   }
     * })
    **/
    count<T extends DocumentCountArgs>(args?: Prisma.Subset<T, DocumentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DocumentCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DocumentAggregateArgs>(args: Prisma.Subset<T, DocumentAggregateArgs>): Prisma.PrismaPromise<GetDocumentAggregateType<T>>;
    /**
     * Group by Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentGroupByArgs} args - Group by arguments.
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
    groupBy<T extends DocumentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DocumentGroupByArgs['orderBy'];
    } : {
        orderBy?: DocumentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Document model
     */
    readonly fields: DocumentFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Document.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__DocumentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the Document model
 */
export interface DocumentFieldRefs {
    readonly id: Prisma.FieldRef<"Document", 'String'>;
    readonly user_id: Prisma.FieldRef<"Document", 'String'>;
    readonly filename: Prisma.FieldRef<"Document", 'String'>;
    readonly original_filename: Prisma.FieldRef<"Document", 'String'>;
    readonly file_path: Prisma.FieldRef<"Document", 'String'>;
    readonly file_size: Prisma.FieldRef<"Document", 'BigInt'>;
    readonly mime_type: Prisma.FieldRef<"Document", 'String'>;
    readonly upload_source: Prisma.FieldRef<"Document", 'String'>;
    readonly parsing_status: Prisma.FieldRef<"Document", 'ParsingStatus'>;
    readonly parsing_error: Prisma.FieldRef<"Document", 'String'>;
    readonly extracted_text: Prisma.FieldRef<"Document", 'String'>;
    readonly document_type: Prisma.FieldRef<"Document", 'String'>;
    readonly document_category: Prisma.FieldRef<"Document", 'String'>;
    readonly confidence_score: Prisma.FieldRef<"Document", 'Float'>;
    readonly extracted_data: Prisma.FieldRef<"Document", 'Json'>;
    readonly gap_detection_status: Prisma.FieldRef<"Document", 'GapDetectionStatus'>;
    readonly detected_gaps: Prisma.FieldRef<"Document", 'Json'>;
    readonly auto_fill_attempts: Prisma.FieldRef<"Document", 'Json'>;
    readonly auto_fill_status: Prisma.FieldRef<"Document", 'AutoFillStatus'>;
    readonly processing_method: Prisma.FieldRef<"Document", 'ProcessingMethod'>;
    readonly processing_duration: Prisma.FieldRef<"Document", 'Int'>;
    readonly ai_model_used: Prisma.FieldRef<"Document", 'String'>;
    readonly page_count: Prisma.FieldRef<"Document", 'Int'>;
    readonly is_password_protected: Prisma.FieldRef<"Document", 'Boolean'>;
    readonly password: Prisma.FieldRef<"Document", 'String'>;
    readonly data_quality_score: Prisma.FieldRef<"Document", 'Float'>;
    readonly validation_errors: Prisma.FieldRef<"Document", 'Json'>;
    readonly created_at: Prisma.FieldRef<"Document", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"Document", 'DateTime'>;
}
/**
 * Document findUnique
 */
export type DocumentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: Prisma.DocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Document
     */
    omit?: Prisma.DocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DocumentInclude<ExtArgs> | null;
    /**
     * Filter, which Document to fetch.
     */
    where: Prisma.DocumentWhereUniqueInput;
};
/**
 * Document findUniqueOrThrow
 */
export type DocumentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: Prisma.DocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Document
     */
    omit?: Prisma.DocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DocumentInclude<ExtArgs> | null;
    /**
     * Filter, which Document to fetch.
     */
    where: Prisma.DocumentWhereUniqueInput;
};
/**
 * Document findFirst
 */
export type DocumentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: Prisma.DocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Document
     */
    omit?: Prisma.DocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DocumentInclude<ExtArgs> | null;
    /**
     * Filter, which Document to fetch.
     */
    where?: Prisma.DocumentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Documents to fetch.
     */
    orderBy?: Prisma.DocumentOrderByWithRelationInput | Prisma.DocumentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Documents.
     */
    cursor?: Prisma.DocumentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Documents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Documents.
     */
    distinct?: Prisma.DocumentScalarFieldEnum | Prisma.DocumentScalarFieldEnum[];
};
/**
 * Document findFirstOrThrow
 */
export type DocumentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: Prisma.DocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Document
     */
    omit?: Prisma.DocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DocumentInclude<ExtArgs> | null;
    /**
     * Filter, which Document to fetch.
     */
    where?: Prisma.DocumentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Documents to fetch.
     */
    orderBy?: Prisma.DocumentOrderByWithRelationInput | Prisma.DocumentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Documents.
     */
    cursor?: Prisma.DocumentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Documents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Documents.
     */
    distinct?: Prisma.DocumentScalarFieldEnum | Prisma.DocumentScalarFieldEnum[];
};
/**
 * Document findMany
 */
export type DocumentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: Prisma.DocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Document
     */
    omit?: Prisma.DocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DocumentInclude<ExtArgs> | null;
    /**
     * Filter, which Documents to fetch.
     */
    where?: Prisma.DocumentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Documents to fetch.
     */
    orderBy?: Prisma.DocumentOrderByWithRelationInput | Prisma.DocumentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Documents.
     */
    cursor?: Prisma.DocumentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Documents.
     */
    skip?: number;
    distinct?: Prisma.DocumentScalarFieldEnum | Prisma.DocumentScalarFieldEnum[];
};
/**
 * Document create
 */
export type DocumentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: Prisma.DocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Document
     */
    omit?: Prisma.DocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DocumentInclude<ExtArgs> | null;
    /**
     * The data needed to create a Document.
     */
    data: Prisma.XOR<Prisma.DocumentCreateInput, Prisma.DocumentUncheckedCreateInput>;
};
/**
 * Document createMany
 */
export type DocumentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Documents.
     */
    data: Prisma.DocumentCreateManyInput | Prisma.DocumentCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Document createManyAndReturn
 */
export type DocumentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: Prisma.DocumentSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Document
     */
    omit?: Prisma.DocumentOmit<ExtArgs> | null;
    /**
     * The data used to create many Documents.
     */
    data: Prisma.DocumentCreateManyInput | Prisma.DocumentCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DocumentIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * Document update
 */
export type DocumentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: Prisma.DocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Document
     */
    omit?: Prisma.DocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DocumentInclude<ExtArgs> | null;
    /**
     * The data needed to update a Document.
     */
    data: Prisma.XOR<Prisma.DocumentUpdateInput, Prisma.DocumentUncheckedUpdateInput>;
    /**
     * Choose, which Document to update.
     */
    where: Prisma.DocumentWhereUniqueInput;
};
/**
 * Document updateMany
 */
export type DocumentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Documents.
     */
    data: Prisma.XOR<Prisma.DocumentUpdateManyMutationInput, Prisma.DocumentUncheckedUpdateManyInput>;
    /**
     * Filter which Documents to update
     */
    where?: Prisma.DocumentWhereInput;
    /**
     * Limit how many Documents to update.
     */
    limit?: number;
};
/**
 * Document updateManyAndReturn
 */
export type DocumentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: Prisma.DocumentSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Document
     */
    omit?: Prisma.DocumentOmit<ExtArgs> | null;
    /**
     * The data used to update Documents.
     */
    data: Prisma.XOR<Prisma.DocumentUpdateManyMutationInput, Prisma.DocumentUncheckedUpdateManyInput>;
    /**
     * Filter which Documents to update
     */
    where?: Prisma.DocumentWhereInput;
    /**
     * Limit how many Documents to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DocumentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * Document upsert
 */
export type DocumentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: Prisma.DocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Document
     */
    omit?: Prisma.DocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DocumentInclude<ExtArgs> | null;
    /**
     * The filter to search for the Document to update in case it exists.
     */
    where: Prisma.DocumentWhereUniqueInput;
    /**
     * In case the Document found by the `where` argument doesn't exist, create a new Document with this data.
     */
    create: Prisma.XOR<Prisma.DocumentCreateInput, Prisma.DocumentUncheckedCreateInput>;
    /**
     * In case the Document was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.DocumentUpdateInput, Prisma.DocumentUncheckedUpdateInput>;
};
/**
 * Document delete
 */
export type DocumentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: Prisma.DocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Document
     */
    omit?: Prisma.DocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DocumentInclude<ExtArgs> | null;
    /**
     * Filter which Document to delete.
     */
    where: Prisma.DocumentWhereUniqueInput;
};
/**
 * Document deleteMany
 */
export type DocumentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Documents to delete
     */
    where?: Prisma.DocumentWhereInput;
    /**
     * Limit how many Documents to delete.
     */
    limit?: number;
};
/**
 * Document without action
 */
export type DocumentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: Prisma.DocumentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Document
     */
    omit?: Prisma.DocumentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.DocumentInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=Document.d.ts.map