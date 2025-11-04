import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model User
 *
 */
export type UserModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>;
export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type UserMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    email: string | null;
    role: string | null;
    password: string | null;
    otp: string | null;
    otp_expires_at: Date | null;
    user_type: string | null;
    google_id: string | null;
    google_email: string | null;
    profile_picture: string | null;
    is_google_user: boolean | null;
    is_verified: boolean | null;
    is_active: boolean | null;
    last_login: Date | null;
    phone: string | null;
    address: string | null;
    date_of_birth: Date | null;
    gmail_tokens: string | null;
    gmail_email: string | null;
    gmail_setup_completed: boolean | null;
    pan_number: string | null;
    family_role: string | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type UserMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    email: string | null;
    role: string | null;
    password: string | null;
    otp: string | null;
    otp_expires_at: Date | null;
    user_type: string | null;
    google_id: string | null;
    google_email: string | null;
    profile_picture: string | null;
    is_google_user: boolean | null;
    is_verified: boolean | null;
    is_active: boolean | null;
    last_login: Date | null;
    phone: string | null;
    address: string | null;
    date_of_birth: Date | null;
    gmail_tokens: string | null;
    gmail_email: string | null;
    gmail_setup_completed: boolean | null;
    pan_number: string | null;
    family_role: string | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type UserCountAggregateOutputType = {
    id: number;
    name: number;
    email: number;
    role: number;
    password: number;
    otp: number;
    otp_expires_at: number;
    user_type: number;
    google_id: number;
    google_email: number;
    profile_picture: number;
    is_google_user: number;
    is_verified: number;
    is_active: number;
    last_login: number;
    phone: number;
    address: number;
    date_of_birth: number;
    gmail_tokens: number;
    gmail_email: number;
    gmail_setup_completed: number;
    pan_number: number;
    asset_preference: number;
    family_role: number;
    created_at: number;
    updated_at: number;
    _all: number;
};
export type UserMinAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    role?: true;
    password?: true;
    otp?: true;
    otp_expires_at?: true;
    user_type?: true;
    google_id?: true;
    google_email?: true;
    profile_picture?: true;
    is_google_user?: true;
    is_verified?: true;
    is_active?: true;
    last_login?: true;
    phone?: true;
    address?: true;
    date_of_birth?: true;
    gmail_tokens?: true;
    gmail_email?: true;
    gmail_setup_completed?: true;
    pan_number?: true;
    family_role?: true;
    created_at?: true;
    updated_at?: true;
};
export type UserMaxAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    role?: true;
    password?: true;
    otp?: true;
    otp_expires_at?: true;
    user_type?: true;
    google_id?: true;
    google_email?: true;
    profile_picture?: true;
    is_google_user?: true;
    is_verified?: true;
    is_active?: true;
    last_login?: true;
    phone?: true;
    address?: true;
    date_of_birth?: true;
    gmail_tokens?: true;
    gmail_email?: true;
    gmail_setup_completed?: true;
    pan_number?: true;
    family_role?: true;
    created_at?: true;
    updated_at?: true;
};
export type UserCountAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    role?: true;
    password?: true;
    otp?: true;
    otp_expires_at?: true;
    user_type?: true;
    google_id?: true;
    google_email?: true;
    profile_picture?: true;
    is_google_user?: true;
    is_verified?: true;
    is_active?: true;
    last_login?: true;
    phone?: true;
    address?: true;
    date_of_birth?: true;
    gmail_tokens?: true;
    gmail_email?: true;
    gmail_setup_completed?: true;
    pan_number?: true;
    asset_preference?: true;
    family_role?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
};
export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType;
};
export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUser[P]> : Prisma.GetScalarType<T[P], AggregateUser[P]>;
};
export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput | Prisma.UserOrderByWithAggregationInput[];
    by: Prisma.UserScalarFieldEnum[] | Prisma.UserScalarFieldEnum;
    having?: Prisma.UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type UserGroupByOutputType = {
    id: string;
    name: string | null;
    email: string | null;
    role: string | null;
    password: string | null;
    otp: string | null;
    otp_expires_at: Date | null;
    user_type: string | null;
    google_id: string | null;
    google_email: string | null;
    profile_picture: string | null;
    is_google_user: boolean;
    is_verified: boolean;
    is_active: boolean;
    last_login: Date | null;
    phone: string | null;
    address: string | null;
    date_of_birth: Date | null;
    gmail_tokens: string | null;
    gmail_email: string | null;
    gmail_setup_completed: boolean;
    pan_number: string | null;
    asset_preference: runtime.JsonValue | null;
    family_role: string | null;
    created_at: Date;
    updated_at: Date;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>;
}>>;
export type UserWhereInput = {
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    id?: Prisma.UuidFilter<"User"> | string;
    name?: Prisma.StringNullableFilter<"User"> | string | null;
    email?: Prisma.StringNullableFilter<"User"> | string | null;
    role?: Prisma.StringNullableFilter<"User"> | string | null;
    password?: Prisma.StringNullableFilter<"User"> | string | null;
    otp?: Prisma.StringNullableFilter<"User"> | string | null;
    otp_expires_at?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    user_type?: Prisma.StringNullableFilter<"User"> | string | null;
    google_id?: Prisma.StringNullableFilter<"User"> | string | null;
    google_email?: Prisma.StringNullableFilter<"User"> | string | null;
    profile_picture?: Prisma.StringNullableFilter<"User"> | string | null;
    is_google_user?: Prisma.BoolFilter<"User"> | boolean;
    is_verified?: Prisma.BoolFilter<"User"> | boolean;
    is_active?: Prisma.BoolFilter<"User"> | boolean;
    last_login?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    phone?: Prisma.StringNullableFilter<"User"> | string | null;
    address?: Prisma.StringNullableFilter<"User"> | string | null;
    date_of_birth?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    gmail_tokens?: Prisma.StringNullableFilter<"User"> | string | null;
    gmail_email?: Prisma.StringNullableFilter<"User"> | string | null;
    gmail_setup_completed?: Prisma.BoolFilter<"User"> | boolean;
    pan_number?: Prisma.StringNullableFilter<"User"> | string | null;
    asset_preference?: Prisma.JsonNullableFilter<"User">;
    family_role?: Prisma.StringNullableFilter<"User"> | string | null;
    created_at?: Prisma.DateTimeFilter<"User"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"User"> | Date | string;
    transactions?: Prisma.TransactionListRelationFilter;
    pdf_documents?: Prisma.PdfDocumentListRelationFilter;
    documents?: Prisma.DocumentListRelationFilter;
    sessions?: Prisma.SessionListRelationFilter;
    assets?: Prisma.AssetListRelationFilter;
    family_access_as_parent?: Prisma.FamilyAccessListRelationFilter;
    family_access_as_family?: Prisma.FamilyAccessListRelationFilter;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    role?: Prisma.SortOrderInput | Prisma.SortOrder;
    password?: Prisma.SortOrderInput | Prisma.SortOrder;
    otp?: Prisma.SortOrderInput | Prisma.SortOrder;
    otp_expires_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    user_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    google_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    google_email?: Prisma.SortOrderInput | Prisma.SortOrder;
    profile_picture?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_google_user?: Prisma.SortOrder;
    is_verified?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    last_login?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    date_of_birth?: Prisma.SortOrderInput | Prisma.SortOrder;
    gmail_tokens?: Prisma.SortOrderInput | Prisma.SortOrder;
    gmail_email?: Prisma.SortOrderInput | Prisma.SortOrder;
    gmail_setup_completed?: Prisma.SortOrder;
    pan_number?: Prisma.SortOrderInput | Prisma.SortOrder;
    asset_preference?: Prisma.SortOrderInput | Prisma.SortOrder;
    family_role?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    transactions?: Prisma.TransactionOrderByRelationAggregateInput;
    pdf_documents?: Prisma.PdfDocumentOrderByRelationAggregateInput;
    documents?: Prisma.DocumentOrderByRelationAggregateInput;
    sessions?: Prisma.SessionOrderByRelationAggregateInput;
    assets?: Prisma.AssetOrderByRelationAggregateInput;
    family_access_as_parent?: Prisma.FamilyAccessOrderByRelationAggregateInput;
    family_access_as_family?: Prisma.FamilyAccessOrderByRelationAggregateInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    google_id?: string;
    phone?: string;
    pan_number?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    name?: Prisma.StringNullableFilter<"User"> | string | null;
    role?: Prisma.StringNullableFilter<"User"> | string | null;
    password?: Prisma.StringNullableFilter<"User"> | string | null;
    otp?: Prisma.StringNullableFilter<"User"> | string | null;
    otp_expires_at?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    user_type?: Prisma.StringNullableFilter<"User"> | string | null;
    google_email?: Prisma.StringNullableFilter<"User"> | string | null;
    profile_picture?: Prisma.StringNullableFilter<"User"> | string | null;
    is_google_user?: Prisma.BoolFilter<"User"> | boolean;
    is_verified?: Prisma.BoolFilter<"User"> | boolean;
    is_active?: Prisma.BoolFilter<"User"> | boolean;
    last_login?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    address?: Prisma.StringNullableFilter<"User"> | string | null;
    date_of_birth?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    gmail_tokens?: Prisma.StringNullableFilter<"User"> | string | null;
    gmail_email?: Prisma.StringNullableFilter<"User"> | string | null;
    gmail_setup_completed?: Prisma.BoolFilter<"User"> | boolean;
    asset_preference?: Prisma.JsonNullableFilter<"User">;
    family_role?: Prisma.StringNullableFilter<"User"> | string | null;
    created_at?: Prisma.DateTimeFilter<"User"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"User"> | Date | string;
    transactions?: Prisma.TransactionListRelationFilter;
    pdf_documents?: Prisma.PdfDocumentListRelationFilter;
    documents?: Prisma.DocumentListRelationFilter;
    sessions?: Prisma.SessionListRelationFilter;
    assets?: Prisma.AssetListRelationFilter;
    family_access_as_parent?: Prisma.FamilyAccessListRelationFilter;
    family_access_as_family?: Prisma.FamilyAccessListRelationFilter;
}, "id" | "email" | "google_id" | "phone" | "pan_number">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    role?: Prisma.SortOrderInput | Prisma.SortOrder;
    password?: Prisma.SortOrderInput | Prisma.SortOrder;
    otp?: Prisma.SortOrderInput | Prisma.SortOrder;
    otp_expires_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    user_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    google_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    google_email?: Prisma.SortOrderInput | Prisma.SortOrder;
    profile_picture?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_google_user?: Prisma.SortOrder;
    is_verified?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    last_login?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    date_of_birth?: Prisma.SortOrderInput | Prisma.SortOrder;
    gmail_tokens?: Prisma.SortOrderInput | Prisma.SortOrder;
    gmail_email?: Prisma.SortOrderInput | Prisma.SortOrder;
    gmail_setup_completed?: Prisma.SortOrder;
    pan_number?: Prisma.SortOrderInput | Prisma.SortOrder;
    asset_preference?: Prisma.SortOrderInput | Prisma.SortOrder;
    family_role?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    _count?: Prisma.UserCountOrderByAggregateInput;
    _max?: Prisma.UserMaxOrderByAggregateInput;
    _min?: Prisma.UserMinOrderByAggregateInput;
};
export type UserScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"User"> | string;
    name?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    email?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    role?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    password?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    otp?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    otp_expires_at?: Prisma.DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null;
    user_type?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    google_id?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    google_email?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    profile_picture?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    is_google_user?: Prisma.BoolWithAggregatesFilter<"User"> | boolean;
    is_verified?: Prisma.BoolWithAggregatesFilter<"User"> | boolean;
    is_active?: Prisma.BoolWithAggregatesFilter<"User"> | boolean;
    last_login?: Prisma.DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null;
    phone?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    address?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    date_of_birth?: Prisma.DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null;
    gmail_tokens?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    gmail_email?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    gmail_setup_completed?: Prisma.BoolWithAggregatesFilter<"User"> | boolean;
    pan_number?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    asset_preference?: Prisma.JsonNullableWithAggregatesFilter<"User">;
    family_role?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    updated_at?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
};
export type UserCreateInput = {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    password?: string | null;
    otp?: string | null;
    otp_expires_at?: Date | string | null;
    user_type?: string | null;
    google_id?: string | null;
    google_email?: string | null;
    profile_picture?: string | null;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: Date | string | null;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: Date | string | null;
    gmail_tokens?: string | null;
    gmail_email?: string | null;
    gmail_setup_completed?: boolean;
    pan_number?: string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    transactions?: Prisma.TransactionCreateNestedManyWithoutUserInput;
    pdf_documents?: Prisma.PdfDocumentCreateNestedManyWithoutUserInput;
    documents?: Prisma.DocumentCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    assets?: Prisma.AssetCreateNestedManyWithoutUserInput;
    family_access_as_parent?: Prisma.FamilyAccessCreateNestedManyWithoutParent_userInput;
    family_access_as_family?: Prisma.FamilyAccessCreateNestedManyWithoutFamily_userInput;
};
export type UserUncheckedCreateInput = {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    password?: string | null;
    otp?: string | null;
    otp_expires_at?: Date | string | null;
    user_type?: string | null;
    google_id?: string | null;
    google_email?: string | null;
    profile_picture?: string | null;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: Date | string | null;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: Date | string | null;
    gmail_tokens?: string | null;
    gmail_email?: string | null;
    gmail_setup_completed?: boolean;
    pan_number?: string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    transactions?: Prisma.TransactionUncheckedCreateNestedManyWithoutUserInput;
    pdf_documents?: Prisma.PdfDocumentUncheckedCreateNestedManyWithoutUserInput;
    documents?: Prisma.DocumentUncheckedCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    assets?: Prisma.AssetUncheckedCreateNestedManyWithoutUserInput;
    family_access_as_parent?: Prisma.FamilyAccessUncheckedCreateNestedManyWithoutParent_userInput;
    family_access_as_family?: Prisma.FamilyAccessUncheckedCreateNestedManyWithoutFamily_userInput;
};
export type UserUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp_expires_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile_picture?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_google_user?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    last_login?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date_of_birth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gmail_tokens?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_setup_completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pan_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUpdateManyWithoutUserNestedInput;
    pdf_documents?: Prisma.PdfDocumentUpdateManyWithoutUserNestedInput;
    documents?: Prisma.DocumentUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    assets?: Prisma.AssetUpdateManyWithoutUserNestedInput;
    family_access_as_parent?: Prisma.FamilyAccessUpdateManyWithoutParent_userNestedInput;
    family_access_as_family?: Prisma.FamilyAccessUpdateManyWithoutFamily_userNestedInput;
};
export type UserUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp_expires_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile_picture?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_google_user?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    last_login?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date_of_birth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gmail_tokens?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_setup_completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pan_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUncheckedUpdateManyWithoutUserNestedInput;
    pdf_documents?: Prisma.PdfDocumentUncheckedUpdateManyWithoutUserNestedInput;
    documents?: Prisma.DocumentUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    assets?: Prisma.AssetUncheckedUpdateManyWithoutUserNestedInput;
    family_access_as_parent?: Prisma.FamilyAccessUncheckedUpdateManyWithoutParent_userNestedInput;
    family_access_as_family?: Prisma.FamilyAccessUncheckedUpdateManyWithoutFamily_userNestedInput;
};
export type UserCreateManyInput = {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    password?: string | null;
    otp?: string | null;
    otp_expires_at?: Date | string | null;
    user_type?: string | null;
    google_id?: string | null;
    google_email?: string | null;
    profile_picture?: string | null;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: Date | string | null;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: Date | string | null;
    gmail_tokens?: string | null;
    gmail_email?: string | null;
    gmail_setup_completed?: boolean;
    pan_number?: string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type UserUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp_expires_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile_picture?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_google_user?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    last_login?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date_of_birth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gmail_tokens?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_setup_completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pan_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp_expires_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile_picture?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_google_user?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    last_login?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date_of_birth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gmail_tokens?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_setup_completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pan_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    otp?: Prisma.SortOrder;
    otp_expires_at?: Prisma.SortOrder;
    user_type?: Prisma.SortOrder;
    google_id?: Prisma.SortOrder;
    google_email?: Prisma.SortOrder;
    profile_picture?: Prisma.SortOrder;
    is_google_user?: Prisma.SortOrder;
    is_verified?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    last_login?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    date_of_birth?: Prisma.SortOrder;
    gmail_tokens?: Prisma.SortOrder;
    gmail_email?: Prisma.SortOrder;
    gmail_setup_completed?: Prisma.SortOrder;
    pan_number?: Prisma.SortOrder;
    asset_preference?: Prisma.SortOrder;
    family_role?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type UserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    otp?: Prisma.SortOrder;
    otp_expires_at?: Prisma.SortOrder;
    user_type?: Prisma.SortOrder;
    google_id?: Prisma.SortOrder;
    google_email?: Prisma.SortOrder;
    profile_picture?: Prisma.SortOrder;
    is_google_user?: Prisma.SortOrder;
    is_verified?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    last_login?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    date_of_birth?: Prisma.SortOrder;
    gmail_tokens?: Prisma.SortOrder;
    gmail_email?: Prisma.SortOrder;
    gmail_setup_completed?: Prisma.SortOrder;
    pan_number?: Prisma.SortOrder;
    family_role?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type UserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    otp?: Prisma.SortOrder;
    otp_expires_at?: Prisma.SortOrder;
    user_type?: Prisma.SortOrder;
    google_id?: Prisma.SortOrder;
    google_email?: Prisma.SortOrder;
    profile_picture?: Prisma.SortOrder;
    is_google_user?: Prisma.SortOrder;
    is_verified?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    last_login?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    date_of_birth?: Prisma.SortOrder;
    gmail_tokens?: Prisma.SortOrder;
    gmail_email?: Prisma.SortOrder;
    gmail_setup_completed?: Prisma.SortOrder;
    pan_number?: Prisma.SortOrder;
    family_role?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type UserScalarRelationFilter = {
    is?: Prisma.UserWhereInput;
    isNot?: Prisma.UserWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type UserCreateNestedOneWithoutSessionsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSessionsInput, Prisma.UserUncheckedCreateWithoutSessionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSessionsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSessionsInput, Prisma.UserUncheckedCreateWithoutSessionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSessionsInput;
    upsert?: Prisma.UserUpsertWithoutSessionsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput, Prisma.UserUpdateWithoutSessionsInput>, Prisma.UserUncheckedUpdateWithoutSessionsInput>;
};
export type UserCreateNestedOneWithoutTransactionsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTransactionsInput, Prisma.UserUncheckedCreateWithoutTransactionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTransactionsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTransactionsInput, Prisma.UserUncheckedCreateWithoutTransactionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTransactionsInput;
    upsert?: Prisma.UserUpsertWithoutTransactionsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutTransactionsInput, Prisma.UserUpdateWithoutTransactionsInput>, Prisma.UserUncheckedUpdateWithoutTransactionsInput>;
};
export type UserCreateNestedOneWithoutPdf_documentsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPdf_documentsInput, Prisma.UserUncheckedCreateWithoutPdf_documentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPdf_documentsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutPdf_documentsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPdf_documentsInput, Prisma.UserUncheckedCreateWithoutPdf_documentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPdf_documentsInput;
    upsert?: Prisma.UserUpsertWithoutPdf_documentsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutPdf_documentsInput, Prisma.UserUpdateWithoutPdf_documentsInput>, Prisma.UserUncheckedUpdateWithoutPdf_documentsInput>;
};
export type UserCreateNestedOneWithoutDocumentsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutDocumentsInput, Prisma.UserUncheckedCreateWithoutDocumentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutDocumentsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutDocumentsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutDocumentsInput, Prisma.UserUncheckedCreateWithoutDocumentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutDocumentsInput;
    upsert?: Prisma.UserUpsertWithoutDocumentsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutDocumentsInput, Prisma.UserUpdateWithoutDocumentsInput>, Prisma.UserUncheckedUpdateWithoutDocumentsInput>;
};
export type UserCreateNestedOneWithoutAssetsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAssetsInput, Prisma.UserUncheckedCreateWithoutAssetsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAssetsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutAssetsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAssetsInput, Prisma.UserUncheckedCreateWithoutAssetsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAssetsInput;
    upsert?: Prisma.UserUpsertWithoutAssetsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutAssetsInput, Prisma.UserUpdateWithoutAssetsInput>, Prisma.UserUncheckedUpdateWithoutAssetsInput>;
};
export type UserCreateNestedOneWithoutFamily_access_as_parentInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutFamily_access_as_parentInput, Prisma.UserUncheckedCreateWithoutFamily_access_as_parentInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutFamily_access_as_parentInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserCreateNestedOneWithoutFamily_access_as_familyInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutFamily_access_as_familyInput, Prisma.UserUncheckedCreateWithoutFamily_access_as_familyInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutFamily_access_as_familyInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutFamily_access_as_parentNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutFamily_access_as_parentInput, Prisma.UserUncheckedCreateWithoutFamily_access_as_parentInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutFamily_access_as_parentInput;
    upsert?: Prisma.UserUpsertWithoutFamily_access_as_parentInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutFamily_access_as_parentInput, Prisma.UserUpdateWithoutFamily_access_as_parentInput>, Prisma.UserUncheckedUpdateWithoutFamily_access_as_parentInput>;
};
export type UserUpdateOneRequiredWithoutFamily_access_as_familyNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutFamily_access_as_familyInput, Prisma.UserUncheckedCreateWithoutFamily_access_as_familyInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutFamily_access_as_familyInput;
    upsert?: Prisma.UserUpsertWithoutFamily_access_as_familyInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutFamily_access_as_familyInput, Prisma.UserUpdateWithoutFamily_access_as_familyInput>, Prisma.UserUncheckedUpdateWithoutFamily_access_as_familyInput>;
};
export type UserCreateWithoutSessionsInput = {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    password?: string | null;
    otp?: string | null;
    otp_expires_at?: Date | string | null;
    user_type?: string | null;
    google_id?: string | null;
    google_email?: string | null;
    profile_picture?: string | null;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: Date | string | null;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: Date | string | null;
    gmail_tokens?: string | null;
    gmail_email?: string | null;
    gmail_setup_completed?: boolean;
    pan_number?: string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    transactions?: Prisma.TransactionCreateNestedManyWithoutUserInput;
    pdf_documents?: Prisma.PdfDocumentCreateNestedManyWithoutUserInput;
    documents?: Prisma.DocumentCreateNestedManyWithoutUserInput;
    assets?: Prisma.AssetCreateNestedManyWithoutUserInput;
    family_access_as_parent?: Prisma.FamilyAccessCreateNestedManyWithoutParent_userInput;
    family_access_as_family?: Prisma.FamilyAccessCreateNestedManyWithoutFamily_userInput;
};
export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    password?: string | null;
    otp?: string | null;
    otp_expires_at?: Date | string | null;
    user_type?: string | null;
    google_id?: string | null;
    google_email?: string | null;
    profile_picture?: string | null;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: Date | string | null;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: Date | string | null;
    gmail_tokens?: string | null;
    gmail_email?: string | null;
    gmail_setup_completed?: boolean;
    pan_number?: string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    transactions?: Prisma.TransactionUncheckedCreateNestedManyWithoutUserInput;
    pdf_documents?: Prisma.PdfDocumentUncheckedCreateNestedManyWithoutUserInput;
    documents?: Prisma.DocumentUncheckedCreateNestedManyWithoutUserInput;
    assets?: Prisma.AssetUncheckedCreateNestedManyWithoutUserInput;
    family_access_as_parent?: Prisma.FamilyAccessUncheckedCreateNestedManyWithoutParent_userInput;
    family_access_as_family?: Prisma.FamilyAccessUncheckedCreateNestedManyWithoutFamily_userInput;
};
export type UserCreateOrConnectWithoutSessionsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutSessionsInput, Prisma.UserUncheckedCreateWithoutSessionsInput>;
};
export type UserUpsertWithoutSessionsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutSessionsInput, Prisma.UserUncheckedUpdateWithoutSessionsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutSessionsInput, Prisma.UserUncheckedCreateWithoutSessionsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutSessionsInput, Prisma.UserUncheckedUpdateWithoutSessionsInput>;
};
export type UserUpdateWithoutSessionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp_expires_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile_picture?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_google_user?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    last_login?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date_of_birth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gmail_tokens?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_setup_completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pan_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUpdateManyWithoutUserNestedInput;
    pdf_documents?: Prisma.PdfDocumentUpdateManyWithoutUserNestedInput;
    documents?: Prisma.DocumentUpdateManyWithoutUserNestedInput;
    assets?: Prisma.AssetUpdateManyWithoutUserNestedInput;
    family_access_as_parent?: Prisma.FamilyAccessUpdateManyWithoutParent_userNestedInput;
    family_access_as_family?: Prisma.FamilyAccessUpdateManyWithoutFamily_userNestedInput;
};
export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp_expires_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile_picture?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_google_user?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    last_login?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date_of_birth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gmail_tokens?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_setup_completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pan_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUncheckedUpdateManyWithoutUserNestedInput;
    pdf_documents?: Prisma.PdfDocumentUncheckedUpdateManyWithoutUserNestedInput;
    documents?: Prisma.DocumentUncheckedUpdateManyWithoutUserNestedInput;
    assets?: Prisma.AssetUncheckedUpdateManyWithoutUserNestedInput;
    family_access_as_parent?: Prisma.FamilyAccessUncheckedUpdateManyWithoutParent_userNestedInput;
    family_access_as_family?: Prisma.FamilyAccessUncheckedUpdateManyWithoutFamily_userNestedInput;
};
export type UserCreateWithoutTransactionsInput = {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    password?: string | null;
    otp?: string | null;
    otp_expires_at?: Date | string | null;
    user_type?: string | null;
    google_id?: string | null;
    google_email?: string | null;
    profile_picture?: string | null;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: Date | string | null;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: Date | string | null;
    gmail_tokens?: string | null;
    gmail_email?: string | null;
    gmail_setup_completed?: boolean;
    pan_number?: string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    pdf_documents?: Prisma.PdfDocumentCreateNestedManyWithoutUserInput;
    documents?: Prisma.DocumentCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    assets?: Prisma.AssetCreateNestedManyWithoutUserInput;
    family_access_as_parent?: Prisma.FamilyAccessCreateNestedManyWithoutParent_userInput;
    family_access_as_family?: Prisma.FamilyAccessCreateNestedManyWithoutFamily_userInput;
};
export type UserUncheckedCreateWithoutTransactionsInput = {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    password?: string | null;
    otp?: string | null;
    otp_expires_at?: Date | string | null;
    user_type?: string | null;
    google_id?: string | null;
    google_email?: string | null;
    profile_picture?: string | null;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: Date | string | null;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: Date | string | null;
    gmail_tokens?: string | null;
    gmail_email?: string | null;
    gmail_setup_completed?: boolean;
    pan_number?: string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    pdf_documents?: Prisma.PdfDocumentUncheckedCreateNestedManyWithoutUserInput;
    documents?: Prisma.DocumentUncheckedCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    assets?: Prisma.AssetUncheckedCreateNestedManyWithoutUserInput;
    family_access_as_parent?: Prisma.FamilyAccessUncheckedCreateNestedManyWithoutParent_userInput;
    family_access_as_family?: Prisma.FamilyAccessUncheckedCreateNestedManyWithoutFamily_userInput;
};
export type UserCreateOrConnectWithoutTransactionsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutTransactionsInput, Prisma.UserUncheckedCreateWithoutTransactionsInput>;
};
export type UserUpsertWithoutTransactionsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutTransactionsInput, Prisma.UserUncheckedUpdateWithoutTransactionsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutTransactionsInput, Prisma.UserUncheckedCreateWithoutTransactionsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutTransactionsInput, Prisma.UserUncheckedUpdateWithoutTransactionsInput>;
};
export type UserUpdateWithoutTransactionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp_expires_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile_picture?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_google_user?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    last_login?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date_of_birth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gmail_tokens?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_setup_completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pan_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pdf_documents?: Prisma.PdfDocumentUpdateManyWithoutUserNestedInput;
    documents?: Prisma.DocumentUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    assets?: Prisma.AssetUpdateManyWithoutUserNestedInput;
    family_access_as_parent?: Prisma.FamilyAccessUpdateManyWithoutParent_userNestedInput;
    family_access_as_family?: Prisma.FamilyAccessUpdateManyWithoutFamily_userNestedInput;
};
export type UserUncheckedUpdateWithoutTransactionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp_expires_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile_picture?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_google_user?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    last_login?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date_of_birth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gmail_tokens?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_setup_completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pan_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pdf_documents?: Prisma.PdfDocumentUncheckedUpdateManyWithoutUserNestedInput;
    documents?: Prisma.DocumentUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    assets?: Prisma.AssetUncheckedUpdateManyWithoutUserNestedInput;
    family_access_as_parent?: Prisma.FamilyAccessUncheckedUpdateManyWithoutParent_userNestedInput;
    family_access_as_family?: Prisma.FamilyAccessUncheckedUpdateManyWithoutFamily_userNestedInput;
};
export type UserCreateWithoutPdf_documentsInput = {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    password?: string | null;
    otp?: string | null;
    otp_expires_at?: Date | string | null;
    user_type?: string | null;
    google_id?: string | null;
    google_email?: string | null;
    profile_picture?: string | null;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: Date | string | null;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: Date | string | null;
    gmail_tokens?: string | null;
    gmail_email?: string | null;
    gmail_setup_completed?: boolean;
    pan_number?: string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    transactions?: Prisma.TransactionCreateNestedManyWithoutUserInput;
    documents?: Prisma.DocumentCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    assets?: Prisma.AssetCreateNestedManyWithoutUserInput;
    family_access_as_parent?: Prisma.FamilyAccessCreateNestedManyWithoutParent_userInput;
    family_access_as_family?: Prisma.FamilyAccessCreateNestedManyWithoutFamily_userInput;
};
export type UserUncheckedCreateWithoutPdf_documentsInput = {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    password?: string | null;
    otp?: string | null;
    otp_expires_at?: Date | string | null;
    user_type?: string | null;
    google_id?: string | null;
    google_email?: string | null;
    profile_picture?: string | null;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: Date | string | null;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: Date | string | null;
    gmail_tokens?: string | null;
    gmail_email?: string | null;
    gmail_setup_completed?: boolean;
    pan_number?: string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    transactions?: Prisma.TransactionUncheckedCreateNestedManyWithoutUserInput;
    documents?: Prisma.DocumentUncheckedCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    assets?: Prisma.AssetUncheckedCreateNestedManyWithoutUserInput;
    family_access_as_parent?: Prisma.FamilyAccessUncheckedCreateNestedManyWithoutParent_userInput;
    family_access_as_family?: Prisma.FamilyAccessUncheckedCreateNestedManyWithoutFamily_userInput;
};
export type UserCreateOrConnectWithoutPdf_documentsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutPdf_documentsInput, Prisma.UserUncheckedCreateWithoutPdf_documentsInput>;
};
export type UserUpsertWithoutPdf_documentsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutPdf_documentsInput, Prisma.UserUncheckedUpdateWithoutPdf_documentsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutPdf_documentsInput, Prisma.UserUncheckedCreateWithoutPdf_documentsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutPdf_documentsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutPdf_documentsInput, Prisma.UserUncheckedUpdateWithoutPdf_documentsInput>;
};
export type UserUpdateWithoutPdf_documentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp_expires_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile_picture?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_google_user?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    last_login?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date_of_birth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gmail_tokens?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_setup_completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pan_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUpdateManyWithoutUserNestedInput;
    documents?: Prisma.DocumentUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    assets?: Prisma.AssetUpdateManyWithoutUserNestedInput;
    family_access_as_parent?: Prisma.FamilyAccessUpdateManyWithoutParent_userNestedInput;
    family_access_as_family?: Prisma.FamilyAccessUpdateManyWithoutFamily_userNestedInput;
};
export type UserUncheckedUpdateWithoutPdf_documentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp_expires_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile_picture?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_google_user?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    last_login?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date_of_birth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gmail_tokens?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_setup_completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pan_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUncheckedUpdateManyWithoutUserNestedInput;
    documents?: Prisma.DocumentUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    assets?: Prisma.AssetUncheckedUpdateManyWithoutUserNestedInput;
    family_access_as_parent?: Prisma.FamilyAccessUncheckedUpdateManyWithoutParent_userNestedInput;
    family_access_as_family?: Prisma.FamilyAccessUncheckedUpdateManyWithoutFamily_userNestedInput;
};
export type UserCreateWithoutDocumentsInput = {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    password?: string | null;
    otp?: string | null;
    otp_expires_at?: Date | string | null;
    user_type?: string | null;
    google_id?: string | null;
    google_email?: string | null;
    profile_picture?: string | null;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: Date | string | null;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: Date | string | null;
    gmail_tokens?: string | null;
    gmail_email?: string | null;
    gmail_setup_completed?: boolean;
    pan_number?: string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    transactions?: Prisma.TransactionCreateNestedManyWithoutUserInput;
    pdf_documents?: Prisma.PdfDocumentCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    assets?: Prisma.AssetCreateNestedManyWithoutUserInput;
    family_access_as_parent?: Prisma.FamilyAccessCreateNestedManyWithoutParent_userInput;
    family_access_as_family?: Prisma.FamilyAccessCreateNestedManyWithoutFamily_userInput;
};
export type UserUncheckedCreateWithoutDocumentsInput = {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    password?: string | null;
    otp?: string | null;
    otp_expires_at?: Date | string | null;
    user_type?: string | null;
    google_id?: string | null;
    google_email?: string | null;
    profile_picture?: string | null;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: Date | string | null;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: Date | string | null;
    gmail_tokens?: string | null;
    gmail_email?: string | null;
    gmail_setup_completed?: boolean;
    pan_number?: string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    transactions?: Prisma.TransactionUncheckedCreateNestedManyWithoutUserInput;
    pdf_documents?: Prisma.PdfDocumentUncheckedCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    assets?: Prisma.AssetUncheckedCreateNestedManyWithoutUserInput;
    family_access_as_parent?: Prisma.FamilyAccessUncheckedCreateNestedManyWithoutParent_userInput;
    family_access_as_family?: Prisma.FamilyAccessUncheckedCreateNestedManyWithoutFamily_userInput;
};
export type UserCreateOrConnectWithoutDocumentsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutDocumentsInput, Prisma.UserUncheckedCreateWithoutDocumentsInput>;
};
export type UserUpsertWithoutDocumentsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutDocumentsInput, Prisma.UserUncheckedUpdateWithoutDocumentsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutDocumentsInput, Prisma.UserUncheckedCreateWithoutDocumentsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutDocumentsInput, Prisma.UserUncheckedUpdateWithoutDocumentsInput>;
};
export type UserUpdateWithoutDocumentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp_expires_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile_picture?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_google_user?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    last_login?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date_of_birth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gmail_tokens?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_setup_completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pan_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUpdateManyWithoutUserNestedInput;
    pdf_documents?: Prisma.PdfDocumentUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    assets?: Prisma.AssetUpdateManyWithoutUserNestedInput;
    family_access_as_parent?: Prisma.FamilyAccessUpdateManyWithoutParent_userNestedInput;
    family_access_as_family?: Prisma.FamilyAccessUpdateManyWithoutFamily_userNestedInput;
};
export type UserUncheckedUpdateWithoutDocumentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp_expires_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile_picture?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_google_user?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    last_login?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date_of_birth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gmail_tokens?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_setup_completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pan_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUncheckedUpdateManyWithoutUserNestedInput;
    pdf_documents?: Prisma.PdfDocumentUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    assets?: Prisma.AssetUncheckedUpdateManyWithoutUserNestedInput;
    family_access_as_parent?: Prisma.FamilyAccessUncheckedUpdateManyWithoutParent_userNestedInput;
    family_access_as_family?: Prisma.FamilyAccessUncheckedUpdateManyWithoutFamily_userNestedInput;
};
export type UserCreateWithoutAssetsInput = {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    password?: string | null;
    otp?: string | null;
    otp_expires_at?: Date | string | null;
    user_type?: string | null;
    google_id?: string | null;
    google_email?: string | null;
    profile_picture?: string | null;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: Date | string | null;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: Date | string | null;
    gmail_tokens?: string | null;
    gmail_email?: string | null;
    gmail_setup_completed?: boolean;
    pan_number?: string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    transactions?: Prisma.TransactionCreateNestedManyWithoutUserInput;
    pdf_documents?: Prisma.PdfDocumentCreateNestedManyWithoutUserInput;
    documents?: Prisma.DocumentCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    family_access_as_parent?: Prisma.FamilyAccessCreateNestedManyWithoutParent_userInput;
    family_access_as_family?: Prisma.FamilyAccessCreateNestedManyWithoutFamily_userInput;
};
export type UserUncheckedCreateWithoutAssetsInput = {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    password?: string | null;
    otp?: string | null;
    otp_expires_at?: Date | string | null;
    user_type?: string | null;
    google_id?: string | null;
    google_email?: string | null;
    profile_picture?: string | null;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: Date | string | null;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: Date | string | null;
    gmail_tokens?: string | null;
    gmail_email?: string | null;
    gmail_setup_completed?: boolean;
    pan_number?: string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    transactions?: Prisma.TransactionUncheckedCreateNestedManyWithoutUserInput;
    pdf_documents?: Prisma.PdfDocumentUncheckedCreateNestedManyWithoutUserInput;
    documents?: Prisma.DocumentUncheckedCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    family_access_as_parent?: Prisma.FamilyAccessUncheckedCreateNestedManyWithoutParent_userInput;
    family_access_as_family?: Prisma.FamilyAccessUncheckedCreateNestedManyWithoutFamily_userInput;
};
export type UserCreateOrConnectWithoutAssetsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutAssetsInput, Prisma.UserUncheckedCreateWithoutAssetsInput>;
};
export type UserUpsertWithoutAssetsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutAssetsInput, Prisma.UserUncheckedUpdateWithoutAssetsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutAssetsInput, Prisma.UserUncheckedCreateWithoutAssetsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutAssetsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutAssetsInput, Prisma.UserUncheckedUpdateWithoutAssetsInput>;
};
export type UserUpdateWithoutAssetsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp_expires_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile_picture?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_google_user?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    last_login?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date_of_birth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gmail_tokens?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_setup_completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pan_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUpdateManyWithoutUserNestedInput;
    pdf_documents?: Prisma.PdfDocumentUpdateManyWithoutUserNestedInput;
    documents?: Prisma.DocumentUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    family_access_as_parent?: Prisma.FamilyAccessUpdateManyWithoutParent_userNestedInput;
    family_access_as_family?: Prisma.FamilyAccessUpdateManyWithoutFamily_userNestedInput;
};
export type UserUncheckedUpdateWithoutAssetsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp_expires_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile_picture?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_google_user?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    last_login?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date_of_birth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gmail_tokens?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_setup_completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pan_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUncheckedUpdateManyWithoutUserNestedInput;
    pdf_documents?: Prisma.PdfDocumentUncheckedUpdateManyWithoutUserNestedInput;
    documents?: Prisma.DocumentUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    family_access_as_parent?: Prisma.FamilyAccessUncheckedUpdateManyWithoutParent_userNestedInput;
    family_access_as_family?: Prisma.FamilyAccessUncheckedUpdateManyWithoutFamily_userNestedInput;
};
export type UserCreateWithoutFamily_access_as_parentInput = {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    password?: string | null;
    otp?: string | null;
    otp_expires_at?: Date | string | null;
    user_type?: string | null;
    google_id?: string | null;
    google_email?: string | null;
    profile_picture?: string | null;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: Date | string | null;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: Date | string | null;
    gmail_tokens?: string | null;
    gmail_email?: string | null;
    gmail_setup_completed?: boolean;
    pan_number?: string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    transactions?: Prisma.TransactionCreateNestedManyWithoutUserInput;
    pdf_documents?: Prisma.PdfDocumentCreateNestedManyWithoutUserInput;
    documents?: Prisma.DocumentCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    assets?: Prisma.AssetCreateNestedManyWithoutUserInput;
    family_access_as_family?: Prisma.FamilyAccessCreateNestedManyWithoutFamily_userInput;
};
export type UserUncheckedCreateWithoutFamily_access_as_parentInput = {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    password?: string | null;
    otp?: string | null;
    otp_expires_at?: Date | string | null;
    user_type?: string | null;
    google_id?: string | null;
    google_email?: string | null;
    profile_picture?: string | null;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: Date | string | null;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: Date | string | null;
    gmail_tokens?: string | null;
    gmail_email?: string | null;
    gmail_setup_completed?: boolean;
    pan_number?: string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    transactions?: Prisma.TransactionUncheckedCreateNestedManyWithoutUserInput;
    pdf_documents?: Prisma.PdfDocumentUncheckedCreateNestedManyWithoutUserInput;
    documents?: Prisma.DocumentUncheckedCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    assets?: Prisma.AssetUncheckedCreateNestedManyWithoutUserInput;
    family_access_as_family?: Prisma.FamilyAccessUncheckedCreateNestedManyWithoutFamily_userInput;
};
export type UserCreateOrConnectWithoutFamily_access_as_parentInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutFamily_access_as_parentInput, Prisma.UserUncheckedCreateWithoutFamily_access_as_parentInput>;
};
export type UserCreateWithoutFamily_access_as_familyInput = {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    password?: string | null;
    otp?: string | null;
    otp_expires_at?: Date | string | null;
    user_type?: string | null;
    google_id?: string | null;
    google_email?: string | null;
    profile_picture?: string | null;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: Date | string | null;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: Date | string | null;
    gmail_tokens?: string | null;
    gmail_email?: string | null;
    gmail_setup_completed?: boolean;
    pan_number?: string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    transactions?: Prisma.TransactionCreateNestedManyWithoutUserInput;
    pdf_documents?: Prisma.PdfDocumentCreateNestedManyWithoutUserInput;
    documents?: Prisma.DocumentCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    assets?: Prisma.AssetCreateNestedManyWithoutUserInput;
    family_access_as_parent?: Prisma.FamilyAccessCreateNestedManyWithoutParent_userInput;
};
export type UserUncheckedCreateWithoutFamily_access_as_familyInput = {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    password?: string | null;
    otp?: string | null;
    otp_expires_at?: Date | string | null;
    user_type?: string | null;
    google_id?: string | null;
    google_email?: string | null;
    profile_picture?: string | null;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: Date | string | null;
    phone?: string | null;
    address?: string | null;
    date_of_birth?: Date | string | null;
    gmail_tokens?: string | null;
    gmail_email?: string | null;
    gmail_setup_completed?: boolean;
    pan_number?: string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    transactions?: Prisma.TransactionUncheckedCreateNestedManyWithoutUserInput;
    pdf_documents?: Prisma.PdfDocumentUncheckedCreateNestedManyWithoutUserInput;
    documents?: Prisma.DocumentUncheckedCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    assets?: Prisma.AssetUncheckedCreateNestedManyWithoutUserInput;
    family_access_as_parent?: Prisma.FamilyAccessUncheckedCreateNestedManyWithoutParent_userInput;
};
export type UserCreateOrConnectWithoutFamily_access_as_familyInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutFamily_access_as_familyInput, Prisma.UserUncheckedCreateWithoutFamily_access_as_familyInput>;
};
export type UserUpsertWithoutFamily_access_as_parentInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutFamily_access_as_parentInput, Prisma.UserUncheckedUpdateWithoutFamily_access_as_parentInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutFamily_access_as_parentInput, Prisma.UserUncheckedCreateWithoutFamily_access_as_parentInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutFamily_access_as_parentInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutFamily_access_as_parentInput, Prisma.UserUncheckedUpdateWithoutFamily_access_as_parentInput>;
};
export type UserUpdateWithoutFamily_access_as_parentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp_expires_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile_picture?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_google_user?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    last_login?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date_of_birth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gmail_tokens?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_setup_completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pan_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUpdateManyWithoutUserNestedInput;
    pdf_documents?: Prisma.PdfDocumentUpdateManyWithoutUserNestedInput;
    documents?: Prisma.DocumentUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    assets?: Prisma.AssetUpdateManyWithoutUserNestedInput;
    family_access_as_family?: Prisma.FamilyAccessUpdateManyWithoutFamily_userNestedInput;
};
export type UserUncheckedUpdateWithoutFamily_access_as_parentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp_expires_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile_picture?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_google_user?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    last_login?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date_of_birth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gmail_tokens?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_setup_completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pan_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUncheckedUpdateManyWithoutUserNestedInput;
    pdf_documents?: Prisma.PdfDocumentUncheckedUpdateManyWithoutUserNestedInput;
    documents?: Prisma.DocumentUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    assets?: Prisma.AssetUncheckedUpdateManyWithoutUserNestedInput;
    family_access_as_family?: Prisma.FamilyAccessUncheckedUpdateManyWithoutFamily_userNestedInput;
};
export type UserUpsertWithoutFamily_access_as_familyInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutFamily_access_as_familyInput, Prisma.UserUncheckedUpdateWithoutFamily_access_as_familyInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutFamily_access_as_familyInput, Prisma.UserUncheckedCreateWithoutFamily_access_as_familyInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutFamily_access_as_familyInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutFamily_access_as_familyInput, Prisma.UserUncheckedUpdateWithoutFamily_access_as_familyInput>;
};
export type UserUpdateWithoutFamily_access_as_familyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp_expires_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile_picture?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_google_user?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    last_login?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date_of_birth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gmail_tokens?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_setup_completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pan_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUpdateManyWithoutUserNestedInput;
    pdf_documents?: Prisma.PdfDocumentUpdateManyWithoutUserNestedInput;
    documents?: Prisma.DocumentUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    assets?: Prisma.AssetUpdateManyWithoutUserNestedInput;
    family_access_as_parent?: Prisma.FamilyAccessUpdateManyWithoutParent_userNestedInput;
};
export type UserUncheckedUpdateWithoutFamily_access_as_familyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otp_expires_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    google_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile_picture?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_google_user?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    last_login?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date_of_birth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    gmail_tokens?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    gmail_setup_completed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    pan_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    asset_preference?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    family_role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUncheckedUpdateManyWithoutUserNestedInput;
    pdf_documents?: Prisma.PdfDocumentUncheckedUpdateManyWithoutUserNestedInput;
    documents?: Prisma.DocumentUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    assets?: Prisma.AssetUncheckedUpdateManyWithoutUserNestedInput;
    family_access_as_parent?: Prisma.FamilyAccessUncheckedUpdateManyWithoutParent_userNestedInput;
};
/**
 * Count Type UserCountOutputType
 */
export type UserCountOutputType = {
    transactions: number;
    pdf_documents: number;
    documents: number;
    sessions: number;
    assets: number;
    family_access_as_parent: number;
    family_access_as_family: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    transactions?: boolean | UserCountOutputTypeCountTransactionsArgs;
    pdf_documents?: boolean | UserCountOutputTypeCountPdf_documentsArgs;
    documents?: boolean | UserCountOutputTypeCountDocumentsArgs;
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs;
    assets?: boolean | UserCountOutputTypeCountAssetsArgs;
    family_access_as_parent?: boolean | UserCountOutputTypeCountFamily_access_as_parentArgs;
    family_access_as_family?: boolean | UserCountOutputTypeCountFamily_access_as_familyArgs;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountTransactionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TransactionWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountPdf_documentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PdfDocumentWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountDocumentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocumentWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SessionWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountAssetsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AssetWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountFamily_access_as_parentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FamilyAccessWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountFamily_access_as_familyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FamilyAccessWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    email?: boolean;
    role?: boolean;
    password?: boolean;
    otp?: boolean;
    otp_expires_at?: boolean;
    user_type?: boolean;
    google_id?: boolean;
    google_email?: boolean;
    profile_picture?: boolean;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: boolean;
    phone?: boolean;
    address?: boolean;
    date_of_birth?: boolean;
    gmail_tokens?: boolean;
    gmail_email?: boolean;
    gmail_setup_completed?: boolean;
    pan_number?: boolean;
    asset_preference?: boolean;
    family_role?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    transactions?: boolean | Prisma.User$transactionsArgs<ExtArgs>;
    pdf_documents?: boolean | Prisma.User$pdf_documentsArgs<ExtArgs>;
    documents?: boolean | Prisma.User$documentsArgs<ExtArgs>;
    sessions?: boolean | Prisma.User$sessionsArgs<ExtArgs>;
    assets?: boolean | Prisma.User$assetsArgs<ExtArgs>;
    family_access_as_parent?: boolean | Prisma.User$family_access_as_parentArgs<ExtArgs>;
    family_access_as_family?: boolean | Prisma.User$family_access_as_familyArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    email?: boolean;
    role?: boolean;
    password?: boolean;
    otp?: boolean;
    otp_expires_at?: boolean;
    user_type?: boolean;
    google_id?: boolean;
    google_email?: boolean;
    profile_picture?: boolean;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: boolean;
    phone?: boolean;
    address?: boolean;
    date_of_birth?: boolean;
    gmail_tokens?: boolean;
    gmail_email?: boolean;
    gmail_setup_completed?: boolean;
    pan_number?: boolean;
    asset_preference?: boolean;
    family_role?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    email?: boolean;
    role?: boolean;
    password?: boolean;
    otp?: boolean;
    otp_expires_at?: boolean;
    user_type?: boolean;
    google_id?: boolean;
    google_email?: boolean;
    profile_picture?: boolean;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: boolean;
    phone?: boolean;
    address?: boolean;
    date_of_birth?: boolean;
    gmail_tokens?: boolean;
    gmail_email?: boolean;
    gmail_setup_completed?: boolean;
    pan_number?: boolean;
    asset_preference?: boolean;
    family_role?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    name?: boolean;
    email?: boolean;
    role?: boolean;
    password?: boolean;
    otp?: boolean;
    otp_expires_at?: boolean;
    user_type?: boolean;
    google_id?: boolean;
    google_email?: boolean;
    profile_picture?: boolean;
    is_google_user?: boolean;
    is_verified?: boolean;
    is_active?: boolean;
    last_login?: boolean;
    phone?: boolean;
    address?: boolean;
    date_of_birth?: boolean;
    gmail_tokens?: boolean;
    gmail_email?: boolean;
    gmail_setup_completed?: boolean;
    pan_number?: boolean;
    asset_preference?: boolean;
    family_role?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "email" | "role" | "password" | "otp" | "otp_expires_at" | "user_type" | "google_id" | "google_email" | "profile_picture" | "is_google_user" | "is_verified" | "is_active" | "last_login" | "phone" | "address" | "date_of_birth" | "gmail_tokens" | "gmail_email" | "gmail_setup_completed" | "pan_number" | "asset_preference" | "family_role" | "created_at" | "updated_at", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    transactions?: boolean | Prisma.User$transactionsArgs<ExtArgs>;
    pdf_documents?: boolean | Prisma.User$pdf_documentsArgs<ExtArgs>;
    documents?: boolean | Prisma.User$documentsArgs<ExtArgs>;
    sessions?: boolean | Prisma.User$sessionsArgs<ExtArgs>;
    assets?: boolean | Prisma.User$assetsArgs<ExtArgs>;
    family_access_as_parent?: boolean | Prisma.User$family_access_as_parentArgs<ExtArgs>;
    family_access_as_family?: boolean | Prisma.User$family_access_as_familyArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
};
export type UserIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type UserIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User";
    objects: {
        transactions: Prisma.$TransactionPayload<ExtArgs>[];
        pdf_documents: Prisma.$PdfDocumentPayload<ExtArgs>[];
        documents: Prisma.$DocumentPayload<ExtArgs>[];
        sessions: Prisma.$SessionPayload<ExtArgs>[];
        assets: Prisma.$AssetPayload<ExtArgs>[];
        family_access_as_parent: Prisma.$FamilyAccessPayload<ExtArgs>[];
        family_access_as_family: Prisma.$FamilyAccessPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string | null;
        email: string | null;
        role: string | null;
        password: string | null;
        otp: string | null;
        otp_expires_at: Date | null;
        user_type: string | null;
        google_id: string | null;
        google_email: string | null;
        profile_picture: string | null;
        is_google_user: boolean;
        is_verified: boolean;
        is_active: boolean;
        last_login: Date | null;
        phone: string | null;
        address: string | null;
        date_of_birth: Date | null;
        gmail_tokens: string | null;
        gmail_email: string | null;
        gmail_setup_completed: boolean;
        pan_number: string | null;
        asset_preference: runtime.JsonValue | null;
        family_role: string | null;
        created_at: Date;
        updated_at: Date;
    }, ExtArgs["result"]["user"]>;
    composites: {};
};
export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>;
export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
};
export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['User'];
        meta: {
            name: 'User';
        };
    };
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     *
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserFindManyArgs>(args?: Prisma.SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     *
     */
    create<T extends UserCreateArgs>(args: Prisma.SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     *
     */
    delete<T extends UserDeleteArgs>(args: Prisma.SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserUpdateArgs>(args: Prisma.SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserUpdateManyArgs>(args: Prisma.SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: Prisma.SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(args?: Prisma.Subset<T, UserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Prisma.Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>;
    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
    groupBy<T extends UserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserGroupByArgs['orderBy'];
    } : {
        orderBy?: UserGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the User model
     */
    readonly fields: UserFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for User.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    transactions<T extends Prisma.User$transactionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    pdf_documents<T extends Prisma.User$pdf_documentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$pdf_documentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PdfDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    documents<T extends Prisma.User$documentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    sessions<T extends Prisma.User$sessionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    assets<T extends Prisma.User$assetsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$assetsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    family_access_as_parent<T extends Prisma.User$family_access_as_parentArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$family_access_as_parentArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FamilyAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    family_access_as_family<T extends Prisma.User$family_access_as_familyArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$family_access_as_familyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FamilyAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the User model
 */
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'String'>;
    readonly name: Prisma.FieldRef<"User", 'String'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly role: Prisma.FieldRef<"User", 'String'>;
    readonly password: Prisma.FieldRef<"User", 'String'>;
    readonly otp: Prisma.FieldRef<"User", 'String'>;
    readonly otp_expires_at: Prisma.FieldRef<"User", 'DateTime'>;
    readonly user_type: Prisma.FieldRef<"User", 'String'>;
    readonly google_id: Prisma.FieldRef<"User", 'String'>;
    readonly google_email: Prisma.FieldRef<"User", 'String'>;
    readonly profile_picture: Prisma.FieldRef<"User", 'String'>;
    readonly is_google_user: Prisma.FieldRef<"User", 'Boolean'>;
    readonly is_verified: Prisma.FieldRef<"User", 'Boolean'>;
    readonly is_active: Prisma.FieldRef<"User", 'Boolean'>;
    readonly last_login: Prisma.FieldRef<"User", 'DateTime'>;
    readonly phone: Prisma.FieldRef<"User", 'String'>;
    readonly address: Prisma.FieldRef<"User", 'String'>;
    readonly date_of_birth: Prisma.FieldRef<"User", 'DateTime'>;
    readonly gmail_tokens: Prisma.FieldRef<"User", 'String'>;
    readonly gmail_email: Prisma.FieldRef<"User", 'String'>;
    readonly gmail_setup_completed: Prisma.FieldRef<"User", 'Boolean'>;
    readonly pan_number: Prisma.FieldRef<"User", 'String'>;
    readonly asset_preference: Prisma.FieldRef<"User", 'Json'>;
    readonly family_role: Prisma.FieldRef<"User", 'String'>;
    readonly created_at: Prisma.FieldRef<"User", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"User", 'DateTime'>;
}
/**
 * User findUnique
 */
export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User findUniqueOrThrow
 */
export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User findFirst
 */
export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * User findFirstOrThrow
 */
export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * User findMany
 */
export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which Users to fetch.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Users.
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * User create
 */
export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * The data needed to create a User.
     */
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
};
/**
 * User createMany
 */
export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * User createManyAndReturn
 */
export type UserCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * The data used to create many Users.
     */
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * User update
 */
export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * The data needed to update a User.
     */
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
    /**
     * Choose, which User to update.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User updateMany
 */
export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: Prisma.UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
};
/**
 * User updateManyAndReturn
 */
export type UserUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * The data used to update Users.
     */
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: Prisma.UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
};
/**
 * User upsert
 */
export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: Prisma.UserWhereUniqueInput;
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
};
/**
 * User delete
 */
export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter which User to delete.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User deleteMany
 */
export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: Prisma.UserWhereInput;
    /**
     * Limit how many Users to delete.
     */
    limit?: number;
};
/**
 * User.transactions
 */
export type User$transactionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    orderBy?: Prisma.TransactionOrderByWithRelationInput | Prisma.TransactionOrderByWithRelationInput[];
    cursor?: Prisma.TransactionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TransactionScalarFieldEnum | Prisma.TransactionScalarFieldEnum[];
};
/**
 * User.pdf_documents
 */
export type User$pdf_documentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.PdfDocumentWhereInput;
    orderBy?: Prisma.PdfDocumentOrderByWithRelationInput | Prisma.PdfDocumentOrderByWithRelationInput[];
    cursor?: Prisma.PdfDocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PdfDocumentScalarFieldEnum | Prisma.PdfDocumentScalarFieldEnum[];
};
/**
 * User.documents
 */
export type User$documentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.DocumentWhereInput;
    orderBy?: Prisma.DocumentOrderByWithRelationInput | Prisma.DocumentOrderByWithRelationInput[];
    cursor?: Prisma.DocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocumentScalarFieldEnum | Prisma.DocumentScalarFieldEnum[];
};
/**
 * User.sessions
 */
export type User$sessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: Prisma.SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: Prisma.SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SessionInclude<ExtArgs> | null;
    where?: Prisma.SessionWhereInput;
    orderBy?: Prisma.SessionOrderByWithRelationInput | Prisma.SessionOrderByWithRelationInput[];
    cursor?: Prisma.SessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SessionScalarFieldEnum | Prisma.SessionScalarFieldEnum[];
};
/**
 * User.assets
 */
export type User$assetsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: Prisma.AssetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Asset
     */
    omit?: Prisma.AssetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AssetInclude<ExtArgs> | null;
    where?: Prisma.AssetWhereInput;
    orderBy?: Prisma.AssetOrderByWithRelationInput | Prisma.AssetOrderByWithRelationInput[];
    cursor?: Prisma.AssetWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AssetScalarFieldEnum | Prisma.AssetScalarFieldEnum[];
};
/**
 * User.family_access_as_parent
 */
export type User$family_access_as_parentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FamilyAccess
     */
    select?: Prisma.FamilyAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FamilyAccess
     */
    omit?: Prisma.FamilyAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FamilyAccessInclude<ExtArgs> | null;
    where?: Prisma.FamilyAccessWhereInput;
    orderBy?: Prisma.FamilyAccessOrderByWithRelationInput | Prisma.FamilyAccessOrderByWithRelationInput[];
    cursor?: Prisma.FamilyAccessWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FamilyAccessScalarFieldEnum | Prisma.FamilyAccessScalarFieldEnum[];
};
/**
 * User.family_access_as_family
 */
export type User$family_access_as_familyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FamilyAccess
     */
    select?: Prisma.FamilyAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FamilyAccess
     */
    omit?: Prisma.FamilyAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FamilyAccessInclude<ExtArgs> | null;
    where?: Prisma.FamilyAccessWhereInput;
    orderBy?: Prisma.FamilyAccessOrderByWithRelationInput | Prisma.FamilyAccessOrderByWithRelationInput[];
    cursor?: Prisma.FamilyAccessWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FamilyAccessScalarFieldEnum | Prisma.FamilyAccessScalarFieldEnum[];
};
/**
 * User without action
 */
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=User.d.ts.map