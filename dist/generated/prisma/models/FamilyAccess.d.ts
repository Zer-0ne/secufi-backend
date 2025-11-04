import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model FamilyAccess
 *
 */
export type FamilyAccessModel = runtime.Types.Result.DefaultSelection<Prisma.$FamilyAccessPayload>;
export type AggregateFamilyAccess = {
    _count: FamilyAccessCountAggregateOutputType | null;
    _min: FamilyAccessMinAggregateOutputType | null;
    _max: FamilyAccessMaxAggregateOutputType | null;
};
export type FamilyAccessMinAggregateOutputType = {
    id: string | null;
    parent_user_id: string | null;
    family_user_id: string | null;
    asset_id: string | null;
    access_expiry: Date | null;
    can_edit: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type FamilyAccessMaxAggregateOutputType = {
    id: string | null;
    parent_user_id: string | null;
    family_user_id: string | null;
    asset_id: string | null;
    access_expiry: Date | null;
    can_edit: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type FamilyAccessCountAggregateOutputType = {
    id: number;
    parent_user_id: number;
    family_user_id: number;
    asset_id: number;
    access_expiry: number;
    can_edit: number;
    created_at: number;
    updated_at: number;
    _all: number;
};
export type FamilyAccessMinAggregateInputType = {
    id?: true;
    parent_user_id?: true;
    family_user_id?: true;
    asset_id?: true;
    access_expiry?: true;
    can_edit?: true;
    created_at?: true;
    updated_at?: true;
};
export type FamilyAccessMaxAggregateInputType = {
    id?: true;
    parent_user_id?: true;
    family_user_id?: true;
    asset_id?: true;
    access_expiry?: true;
    can_edit?: true;
    created_at?: true;
    updated_at?: true;
};
export type FamilyAccessCountAggregateInputType = {
    id?: true;
    parent_user_id?: true;
    family_user_id?: true;
    asset_id?: true;
    access_expiry?: true;
    can_edit?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
};
export type FamilyAccessAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which FamilyAccess to aggregate.
     */
    where?: Prisma.FamilyAccessWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FamilyAccesses to fetch.
     */
    orderBy?: Prisma.FamilyAccessOrderByWithRelationInput | Prisma.FamilyAccessOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.FamilyAccessWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FamilyAccesses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FamilyAccesses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned FamilyAccesses
    **/
    _count?: true | FamilyAccessCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: FamilyAccessMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: FamilyAccessMaxAggregateInputType;
};
export type GetFamilyAccessAggregateType<T extends FamilyAccessAggregateArgs> = {
    [P in keyof T & keyof AggregateFamilyAccess]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateFamilyAccess[P]> : Prisma.GetScalarType<T[P], AggregateFamilyAccess[P]>;
};
export type FamilyAccessGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FamilyAccessWhereInput;
    orderBy?: Prisma.FamilyAccessOrderByWithAggregationInput | Prisma.FamilyAccessOrderByWithAggregationInput[];
    by: Prisma.FamilyAccessScalarFieldEnum[] | Prisma.FamilyAccessScalarFieldEnum;
    having?: Prisma.FamilyAccessScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FamilyAccessCountAggregateInputType | true;
    _min?: FamilyAccessMinAggregateInputType;
    _max?: FamilyAccessMaxAggregateInputType;
};
export type FamilyAccessGroupByOutputType = {
    id: string;
    parent_user_id: string;
    family_user_id: string;
    asset_id: string;
    access_expiry: Date | null;
    can_edit: boolean;
    created_at: Date;
    updated_at: Date;
    _count: FamilyAccessCountAggregateOutputType | null;
    _min: FamilyAccessMinAggregateOutputType | null;
    _max: FamilyAccessMaxAggregateOutputType | null;
};
type GetFamilyAccessGroupByPayload<T extends FamilyAccessGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<FamilyAccessGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof FamilyAccessGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], FamilyAccessGroupByOutputType[P]> : Prisma.GetScalarType<T[P], FamilyAccessGroupByOutputType[P]>;
}>>;
export type FamilyAccessWhereInput = {
    AND?: Prisma.FamilyAccessWhereInput | Prisma.FamilyAccessWhereInput[];
    OR?: Prisma.FamilyAccessWhereInput[];
    NOT?: Prisma.FamilyAccessWhereInput | Prisma.FamilyAccessWhereInput[];
    id?: Prisma.UuidFilter<"FamilyAccess"> | string;
    parent_user_id?: Prisma.UuidFilter<"FamilyAccess"> | string;
    family_user_id?: Prisma.UuidFilter<"FamilyAccess"> | string;
    asset_id?: Prisma.UuidFilter<"FamilyAccess"> | string;
    access_expiry?: Prisma.DateTimeNullableFilter<"FamilyAccess"> | Date | string | null;
    can_edit?: Prisma.BoolFilter<"FamilyAccess"> | boolean;
    created_at?: Prisma.DateTimeFilter<"FamilyAccess"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"FamilyAccess"> | Date | string;
    parent_user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    family_user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    asset?: Prisma.XOR<Prisma.AssetScalarRelationFilter, Prisma.AssetWhereInput>;
};
export type FamilyAccessOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    parent_user_id?: Prisma.SortOrder;
    family_user_id?: Prisma.SortOrder;
    asset_id?: Prisma.SortOrder;
    access_expiry?: Prisma.SortOrderInput | Prisma.SortOrder;
    can_edit?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    parent_user?: Prisma.UserOrderByWithRelationInput;
    family_user?: Prisma.UserOrderByWithRelationInput;
    asset?: Prisma.AssetOrderByWithRelationInput;
};
export type FamilyAccessWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    parent_user_id_family_user_id_asset_id?: Prisma.FamilyAccessParent_user_idFamily_user_idAsset_idCompoundUniqueInput;
    AND?: Prisma.FamilyAccessWhereInput | Prisma.FamilyAccessWhereInput[];
    OR?: Prisma.FamilyAccessWhereInput[];
    NOT?: Prisma.FamilyAccessWhereInput | Prisma.FamilyAccessWhereInput[];
    parent_user_id?: Prisma.UuidFilter<"FamilyAccess"> | string;
    family_user_id?: Prisma.UuidFilter<"FamilyAccess"> | string;
    asset_id?: Prisma.UuidFilter<"FamilyAccess"> | string;
    access_expiry?: Prisma.DateTimeNullableFilter<"FamilyAccess"> | Date | string | null;
    can_edit?: Prisma.BoolFilter<"FamilyAccess"> | boolean;
    created_at?: Prisma.DateTimeFilter<"FamilyAccess"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"FamilyAccess"> | Date | string;
    parent_user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    family_user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    asset?: Prisma.XOR<Prisma.AssetScalarRelationFilter, Prisma.AssetWhereInput>;
}, "id" | "parent_user_id_family_user_id_asset_id">;
export type FamilyAccessOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    parent_user_id?: Prisma.SortOrder;
    family_user_id?: Prisma.SortOrder;
    asset_id?: Prisma.SortOrder;
    access_expiry?: Prisma.SortOrderInput | Prisma.SortOrder;
    can_edit?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    _count?: Prisma.FamilyAccessCountOrderByAggregateInput;
    _max?: Prisma.FamilyAccessMaxOrderByAggregateInput;
    _min?: Prisma.FamilyAccessMinOrderByAggregateInput;
};
export type FamilyAccessScalarWhereWithAggregatesInput = {
    AND?: Prisma.FamilyAccessScalarWhereWithAggregatesInput | Prisma.FamilyAccessScalarWhereWithAggregatesInput[];
    OR?: Prisma.FamilyAccessScalarWhereWithAggregatesInput[];
    NOT?: Prisma.FamilyAccessScalarWhereWithAggregatesInput | Prisma.FamilyAccessScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"FamilyAccess"> | string;
    parent_user_id?: Prisma.UuidWithAggregatesFilter<"FamilyAccess"> | string;
    family_user_id?: Prisma.UuidWithAggregatesFilter<"FamilyAccess"> | string;
    asset_id?: Prisma.UuidWithAggregatesFilter<"FamilyAccess"> | string;
    access_expiry?: Prisma.DateTimeNullableWithAggregatesFilter<"FamilyAccess"> | Date | string | null;
    can_edit?: Prisma.BoolWithAggregatesFilter<"FamilyAccess"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"FamilyAccess"> | Date | string;
    updated_at?: Prisma.DateTimeWithAggregatesFilter<"FamilyAccess"> | Date | string;
};
export type FamilyAccessCreateInput = {
    id?: string;
    access_expiry?: Date | string | null;
    can_edit?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    parent_user: Prisma.UserCreateNestedOneWithoutFamily_access_as_parentInput;
    family_user: Prisma.UserCreateNestedOneWithoutFamily_access_as_familyInput;
    asset: Prisma.AssetCreateNestedOneWithoutFamily_accessInput;
};
export type FamilyAccessUncheckedCreateInput = {
    id?: string;
    parent_user_id: string;
    family_user_id: string;
    asset_id: string;
    access_expiry?: Date | string | null;
    can_edit?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type FamilyAccessUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    access_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    can_edit?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    parent_user?: Prisma.UserUpdateOneRequiredWithoutFamily_access_as_parentNestedInput;
    family_user?: Prisma.UserUpdateOneRequiredWithoutFamily_access_as_familyNestedInput;
    asset?: Prisma.AssetUpdateOneRequiredWithoutFamily_accessNestedInput;
};
export type FamilyAccessUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    parent_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    family_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    asset_id?: Prisma.StringFieldUpdateOperationsInput | string;
    access_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    can_edit?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FamilyAccessCreateManyInput = {
    id?: string;
    parent_user_id: string;
    family_user_id: string;
    asset_id: string;
    access_expiry?: Date | string | null;
    can_edit?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type FamilyAccessUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    access_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    can_edit?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FamilyAccessUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    parent_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    family_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    asset_id?: Prisma.StringFieldUpdateOperationsInput | string;
    access_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    can_edit?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FamilyAccessListRelationFilter = {
    every?: Prisma.FamilyAccessWhereInput;
    some?: Prisma.FamilyAccessWhereInput;
    none?: Prisma.FamilyAccessWhereInput;
};
export type FamilyAccessOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type FamilyAccessParent_user_idFamily_user_idAsset_idCompoundUniqueInput = {
    parent_user_id: string;
    family_user_id: string;
    asset_id: string;
};
export type FamilyAccessCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    parent_user_id?: Prisma.SortOrder;
    family_user_id?: Prisma.SortOrder;
    asset_id?: Prisma.SortOrder;
    access_expiry?: Prisma.SortOrder;
    can_edit?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type FamilyAccessMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    parent_user_id?: Prisma.SortOrder;
    family_user_id?: Prisma.SortOrder;
    asset_id?: Prisma.SortOrder;
    access_expiry?: Prisma.SortOrder;
    can_edit?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type FamilyAccessMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    parent_user_id?: Prisma.SortOrder;
    family_user_id?: Prisma.SortOrder;
    asset_id?: Prisma.SortOrder;
    access_expiry?: Prisma.SortOrder;
    can_edit?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type FamilyAccessCreateNestedManyWithoutParent_userInput = {
    create?: Prisma.XOR<Prisma.FamilyAccessCreateWithoutParent_userInput, Prisma.FamilyAccessUncheckedCreateWithoutParent_userInput> | Prisma.FamilyAccessCreateWithoutParent_userInput[] | Prisma.FamilyAccessUncheckedCreateWithoutParent_userInput[];
    connectOrCreate?: Prisma.FamilyAccessCreateOrConnectWithoutParent_userInput | Prisma.FamilyAccessCreateOrConnectWithoutParent_userInput[];
    createMany?: Prisma.FamilyAccessCreateManyParent_userInputEnvelope;
    connect?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
};
export type FamilyAccessCreateNestedManyWithoutFamily_userInput = {
    create?: Prisma.XOR<Prisma.FamilyAccessCreateWithoutFamily_userInput, Prisma.FamilyAccessUncheckedCreateWithoutFamily_userInput> | Prisma.FamilyAccessCreateWithoutFamily_userInput[] | Prisma.FamilyAccessUncheckedCreateWithoutFamily_userInput[];
    connectOrCreate?: Prisma.FamilyAccessCreateOrConnectWithoutFamily_userInput | Prisma.FamilyAccessCreateOrConnectWithoutFamily_userInput[];
    createMany?: Prisma.FamilyAccessCreateManyFamily_userInputEnvelope;
    connect?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
};
export type FamilyAccessUncheckedCreateNestedManyWithoutParent_userInput = {
    create?: Prisma.XOR<Prisma.FamilyAccessCreateWithoutParent_userInput, Prisma.FamilyAccessUncheckedCreateWithoutParent_userInput> | Prisma.FamilyAccessCreateWithoutParent_userInput[] | Prisma.FamilyAccessUncheckedCreateWithoutParent_userInput[];
    connectOrCreate?: Prisma.FamilyAccessCreateOrConnectWithoutParent_userInput | Prisma.FamilyAccessCreateOrConnectWithoutParent_userInput[];
    createMany?: Prisma.FamilyAccessCreateManyParent_userInputEnvelope;
    connect?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
};
export type FamilyAccessUncheckedCreateNestedManyWithoutFamily_userInput = {
    create?: Prisma.XOR<Prisma.FamilyAccessCreateWithoutFamily_userInput, Prisma.FamilyAccessUncheckedCreateWithoutFamily_userInput> | Prisma.FamilyAccessCreateWithoutFamily_userInput[] | Prisma.FamilyAccessUncheckedCreateWithoutFamily_userInput[];
    connectOrCreate?: Prisma.FamilyAccessCreateOrConnectWithoutFamily_userInput | Prisma.FamilyAccessCreateOrConnectWithoutFamily_userInput[];
    createMany?: Prisma.FamilyAccessCreateManyFamily_userInputEnvelope;
    connect?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
};
export type FamilyAccessUpdateManyWithoutParent_userNestedInput = {
    create?: Prisma.XOR<Prisma.FamilyAccessCreateWithoutParent_userInput, Prisma.FamilyAccessUncheckedCreateWithoutParent_userInput> | Prisma.FamilyAccessCreateWithoutParent_userInput[] | Prisma.FamilyAccessUncheckedCreateWithoutParent_userInput[];
    connectOrCreate?: Prisma.FamilyAccessCreateOrConnectWithoutParent_userInput | Prisma.FamilyAccessCreateOrConnectWithoutParent_userInput[];
    upsert?: Prisma.FamilyAccessUpsertWithWhereUniqueWithoutParent_userInput | Prisma.FamilyAccessUpsertWithWhereUniqueWithoutParent_userInput[];
    createMany?: Prisma.FamilyAccessCreateManyParent_userInputEnvelope;
    set?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    disconnect?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    delete?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    connect?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    update?: Prisma.FamilyAccessUpdateWithWhereUniqueWithoutParent_userInput | Prisma.FamilyAccessUpdateWithWhereUniqueWithoutParent_userInput[];
    updateMany?: Prisma.FamilyAccessUpdateManyWithWhereWithoutParent_userInput | Prisma.FamilyAccessUpdateManyWithWhereWithoutParent_userInput[];
    deleteMany?: Prisma.FamilyAccessScalarWhereInput | Prisma.FamilyAccessScalarWhereInput[];
};
export type FamilyAccessUpdateManyWithoutFamily_userNestedInput = {
    create?: Prisma.XOR<Prisma.FamilyAccessCreateWithoutFamily_userInput, Prisma.FamilyAccessUncheckedCreateWithoutFamily_userInput> | Prisma.FamilyAccessCreateWithoutFamily_userInput[] | Prisma.FamilyAccessUncheckedCreateWithoutFamily_userInput[];
    connectOrCreate?: Prisma.FamilyAccessCreateOrConnectWithoutFamily_userInput | Prisma.FamilyAccessCreateOrConnectWithoutFamily_userInput[];
    upsert?: Prisma.FamilyAccessUpsertWithWhereUniqueWithoutFamily_userInput | Prisma.FamilyAccessUpsertWithWhereUniqueWithoutFamily_userInput[];
    createMany?: Prisma.FamilyAccessCreateManyFamily_userInputEnvelope;
    set?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    disconnect?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    delete?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    connect?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    update?: Prisma.FamilyAccessUpdateWithWhereUniqueWithoutFamily_userInput | Prisma.FamilyAccessUpdateWithWhereUniqueWithoutFamily_userInput[];
    updateMany?: Prisma.FamilyAccessUpdateManyWithWhereWithoutFamily_userInput | Prisma.FamilyAccessUpdateManyWithWhereWithoutFamily_userInput[];
    deleteMany?: Prisma.FamilyAccessScalarWhereInput | Prisma.FamilyAccessScalarWhereInput[];
};
export type FamilyAccessUncheckedUpdateManyWithoutParent_userNestedInput = {
    create?: Prisma.XOR<Prisma.FamilyAccessCreateWithoutParent_userInput, Prisma.FamilyAccessUncheckedCreateWithoutParent_userInput> | Prisma.FamilyAccessCreateWithoutParent_userInput[] | Prisma.FamilyAccessUncheckedCreateWithoutParent_userInput[];
    connectOrCreate?: Prisma.FamilyAccessCreateOrConnectWithoutParent_userInput | Prisma.FamilyAccessCreateOrConnectWithoutParent_userInput[];
    upsert?: Prisma.FamilyAccessUpsertWithWhereUniqueWithoutParent_userInput | Prisma.FamilyAccessUpsertWithWhereUniqueWithoutParent_userInput[];
    createMany?: Prisma.FamilyAccessCreateManyParent_userInputEnvelope;
    set?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    disconnect?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    delete?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    connect?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    update?: Prisma.FamilyAccessUpdateWithWhereUniqueWithoutParent_userInput | Prisma.FamilyAccessUpdateWithWhereUniqueWithoutParent_userInput[];
    updateMany?: Prisma.FamilyAccessUpdateManyWithWhereWithoutParent_userInput | Prisma.FamilyAccessUpdateManyWithWhereWithoutParent_userInput[];
    deleteMany?: Prisma.FamilyAccessScalarWhereInput | Prisma.FamilyAccessScalarWhereInput[];
};
export type FamilyAccessUncheckedUpdateManyWithoutFamily_userNestedInput = {
    create?: Prisma.XOR<Prisma.FamilyAccessCreateWithoutFamily_userInput, Prisma.FamilyAccessUncheckedCreateWithoutFamily_userInput> | Prisma.FamilyAccessCreateWithoutFamily_userInput[] | Prisma.FamilyAccessUncheckedCreateWithoutFamily_userInput[];
    connectOrCreate?: Prisma.FamilyAccessCreateOrConnectWithoutFamily_userInput | Prisma.FamilyAccessCreateOrConnectWithoutFamily_userInput[];
    upsert?: Prisma.FamilyAccessUpsertWithWhereUniqueWithoutFamily_userInput | Prisma.FamilyAccessUpsertWithWhereUniqueWithoutFamily_userInput[];
    createMany?: Prisma.FamilyAccessCreateManyFamily_userInputEnvelope;
    set?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    disconnect?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    delete?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    connect?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    update?: Prisma.FamilyAccessUpdateWithWhereUniqueWithoutFamily_userInput | Prisma.FamilyAccessUpdateWithWhereUniqueWithoutFamily_userInput[];
    updateMany?: Prisma.FamilyAccessUpdateManyWithWhereWithoutFamily_userInput | Prisma.FamilyAccessUpdateManyWithWhereWithoutFamily_userInput[];
    deleteMany?: Prisma.FamilyAccessScalarWhereInput | Prisma.FamilyAccessScalarWhereInput[];
};
export type FamilyAccessCreateNestedManyWithoutAssetInput = {
    create?: Prisma.XOR<Prisma.FamilyAccessCreateWithoutAssetInput, Prisma.FamilyAccessUncheckedCreateWithoutAssetInput> | Prisma.FamilyAccessCreateWithoutAssetInput[] | Prisma.FamilyAccessUncheckedCreateWithoutAssetInput[];
    connectOrCreate?: Prisma.FamilyAccessCreateOrConnectWithoutAssetInput | Prisma.FamilyAccessCreateOrConnectWithoutAssetInput[];
    createMany?: Prisma.FamilyAccessCreateManyAssetInputEnvelope;
    connect?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
};
export type FamilyAccessUncheckedCreateNestedManyWithoutAssetInput = {
    create?: Prisma.XOR<Prisma.FamilyAccessCreateWithoutAssetInput, Prisma.FamilyAccessUncheckedCreateWithoutAssetInput> | Prisma.FamilyAccessCreateWithoutAssetInput[] | Prisma.FamilyAccessUncheckedCreateWithoutAssetInput[];
    connectOrCreate?: Prisma.FamilyAccessCreateOrConnectWithoutAssetInput | Prisma.FamilyAccessCreateOrConnectWithoutAssetInput[];
    createMany?: Prisma.FamilyAccessCreateManyAssetInputEnvelope;
    connect?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
};
export type FamilyAccessUpdateManyWithoutAssetNestedInput = {
    create?: Prisma.XOR<Prisma.FamilyAccessCreateWithoutAssetInput, Prisma.FamilyAccessUncheckedCreateWithoutAssetInput> | Prisma.FamilyAccessCreateWithoutAssetInput[] | Prisma.FamilyAccessUncheckedCreateWithoutAssetInput[];
    connectOrCreate?: Prisma.FamilyAccessCreateOrConnectWithoutAssetInput | Prisma.FamilyAccessCreateOrConnectWithoutAssetInput[];
    upsert?: Prisma.FamilyAccessUpsertWithWhereUniqueWithoutAssetInput | Prisma.FamilyAccessUpsertWithWhereUniqueWithoutAssetInput[];
    createMany?: Prisma.FamilyAccessCreateManyAssetInputEnvelope;
    set?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    disconnect?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    delete?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    connect?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    update?: Prisma.FamilyAccessUpdateWithWhereUniqueWithoutAssetInput | Prisma.FamilyAccessUpdateWithWhereUniqueWithoutAssetInput[];
    updateMany?: Prisma.FamilyAccessUpdateManyWithWhereWithoutAssetInput | Prisma.FamilyAccessUpdateManyWithWhereWithoutAssetInput[];
    deleteMany?: Prisma.FamilyAccessScalarWhereInput | Prisma.FamilyAccessScalarWhereInput[];
};
export type FamilyAccessUncheckedUpdateManyWithoutAssetNestedInput = {
    create?: Prisma.XOR<Prisma.FamilyAccessCreateWithoutAssetInput, Prisma.FamilyAccessUncheckedCreateWithoutAssetInput> | Prisma.FamilyAccessCreateWithoutAssetInput[] | Prisma.FamilyAccessUncheckedCreateWithoutAssetInput[];
    connectOrCreate?: Prisma.FamilyAccessCreateOrConnectWithoutAssetInput | Prisma.FamilyAccessCreateOrConnectWithoutAssetInput[];
    upsert?: Prisma.FamilyAccessUpsertWithWhereUniqueWithoutAssetInput | Prisma.FamilyAccessUpsertWithWhereUniqueWithoutAssetInput[];
    createMany?: Prisma.FamilyAccessCreateManyAssetInputEnvelope;
    set?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    disconnect?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    delete?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    connect?: Prisma.FamilyAccessWhereUniqueInput | Prisma.FamilyAccessWhereUniqueInput[];
    update?: Prisma.FamilyAccessUpdateWithWhereUniqueWithoutAssetInput | Prisma.FamilyAccessUpdateWithWhereUniqueWithoutAssetInput[];
    updateMany?: Prisma.FamilyAccessUpdateManyWithWhereWithoutAssetInput | Prisma.FamilyAccessUpdateManyWithWhereWithoutAssetInput[];
    deleteMany?: Prisma.FamilyAccessScalarWhereInput | Prisma.FamilyAccessScalarWhereInput[];
};
export type FamilyAccessCreateWithoutParent_userInput = {
    id?: string;
    access_expiry?: Date | string | null;
    can_edit?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    family_user: Prisma.UserCreateNestedOneWithoutFamily_access_as_familyInput;
    asset: Prisma.AssetCreateNestedOneWithoutFamily_accessInput;
};
export type FamilyAccessUncheckedCreateWithoutParent_userInput = {
    id?: string;
    family_user_id: string;
    asset_id: string;
    access_expiry?: Date | string | null;
    can_edit?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type FamilyAccessCreateOrConnectWithoutParent_userInput = {
    where: Prisma.FamilyAccessWhereUniqueInput;
    create: Prisma.XOR<Prisma.FamilyAccessCreateWithoutParent_userInput, Prisma.FamilyAccessUncheckedCreateWithoutParent_userInput>;
};
export type FamilyAccessCreateManyParent_userInputEnvelope = {
    data: Prisma.FamilyAccessCreateManyParent_userInput | Prisma.FamilyAccessCreateManyParent_userInput[];
    skipDuplicates?: boolean;
};
export type FamilyAccessCreateWithoutFamily_userInput = {
    id?: string;
    access_expiry?: Date | string | null;
    can_edit?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    parent_user: Prisma.UserCreateNestedOneWithoutFamily_access_as_parentInput;
    asset: Prisma.AssetCreateNestedOneWithoutFamily_accessInput;
};
export type FamilyAccessUncheckedCreateWithoutFamily_userInput = {
    id?: string;
    parent_user_id: string;
    asset_id: string;
    access_expiry?: Date | string | null;
    can_edit?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type FamilyAccessCreateOrConnectWithoutFamily_userInput = {
    where: Prisma.FamilyAccessWhereUniqueInput;
    create: Prisma.XOR<Prisma.FamilyAccessCreateWithoutFamily_userInput, Prisma.FamilyAccessUncheckedCreateWithoutFamily_userInput>;
};
export type FamilyAccessCreateManyFamily_userInputEnvelope = {
    data: Prisma.FamilyAccessCreateManyFamily_userInput | Prisma.FamilyAccessCreateManyFamily_userInput[];
    skipDuplicates?: boolean;
};
export type FamilyAccessUpsertWithWhereUniqueWithoutParent_userInput = {
    where: Prisma.FamilyAccessWhereUniqueInput;
    update: Prisma.XOR<Prisma.FamilyAccessUpdateWithoutParent_userInput, Prisma.FamilyAccessUncheckedUpdateWithoutParent_userInput>;
    create: Prisma.XOR<Prisma.FamilyAccessCreateWithoutParent_userInput, Prisma.FamilyAccessUncheckedCreateWithoutParent_userInput>;
};
export type FamilyAccessUpdateWithWhereUniqueWithoutParent_userInput = {
    where: Prisma.FamilyAccessWhereUniqueInput;
    data: Prisma.XOR<Prisma.FamilyAccessUpdateWithoutParent_userInput, Prisma.FamilyAccessUncheckedUpdateWithoutParent_userInput>;
};
export type FamilyAccessUpdateManyWithWhereWithoutParent_userInput = {
    where: Prisma.FamilyAccessScalarWhereInput;
    data: Prisma.XOR<Prisma.FamilyAccessUpdateManyMutationInput, Prisma.FamilyAccessUncheckedUpdateManyWithoutParent_userInput>;
};
export type FamilyAccessScalarWhereInput = {
    AND?: Prisma.FamilyAccessScalarWhereInput | Prisma.FamilyAccessScalarWhereInput[];
    OR?: Prisma.FamilyAccessScalarWhereInput[];
    NOT?: Prisma.FamilyAccessScalarWhereInput | Prisma.FamilyAccessScalarWhereInput[];
    id?: Prisma.UuidFilter<"FamilyAccess"> | string;
    parent_user_id?: Prisma.UuidFilter<"FamilyAccess"> | string;
    family_user_id?: Prisma.UuidFilter<"FamilyAccess"> | string;
    asset_id?: Prisma.UuidFilter<"FamilyAccess"> | string;
    access_expiry?: Prisma.DateTimeNullableFilter<"FamilyAccess"> | Date | string | null;
    can_edit?: Prisma.BoolFilter<"FamilyAccess"> | boolean;
    created_at?: Prisma.DateTimeFilter<"FamilyAccess"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"FamilyAccess"> | Date | string;
};
export type FamilyAccessUpsertWithWhereUniqueWithoutFamily_userInput = {
    where: Prisma.FamilyAccessWhereUniqueInput;
    update: Prisma.XOR<Prisma.FamilyAccessUpdateWithoutFamily_userInput, Prisma.FamilyAccessUncheckedUpdateWithoutFamily_userInput>;
    create: Prisma.XOR<Prisma.FamilyAccessCreateWithoutFamily_userInput, Prisma.FamilyAccessUncheckedCreateWithoutFamily_userInput>;
};
export type FamilyAccessUpdateWithWhereUniqueWithoutFamily_userInput = {
    where: Prisma.FamilyAccessWhereUniqueInput;
    data: Prisma.XOR<Prisma.FamilyAccessUpdateWithoutFamily_userInput, Prisma.FamilyAccessUncheckedUpdateWithoutFamily_userInput>;
};
export type FamilyAccessUpdateManyWithWhereWithoutFamily_userInput = {
    where: Prisma.FamilyAccessScalarWhereInput;
    data: Prisma.XOR<Prisma.FamilyAccessUpdateManyMutationInput, Prisma.FamilyAccessUncheckedUpdateManyWithoutFamily_userInput>;
};
export type FamilyAccessCreateWithoutAssetInput = {
    id?: string;
    access_expiry?: Date | string | null;
    can_edit?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
    parent_user: Prisma.UserCreateNestedOneWithoutFamily_access_as_parentInput;
    family_user: Prisma.UserCreateNestedOneWithoutFamily_access_as_familyInput;
};
export type FamilyAccessUncheckedCreateWithoutAssetInput = {
    id?: string;
    parent_user_id: string;
    family_user_id: string;
    access_expiry?: Date | string | null;
    can_edit?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type FamilyAccessCreateOrConnectWithoutAssetInput = {
    where: Prisma.FamilyAccessWhereUniqueInput;
    create: Prisma.XOR<Prisma.FamilyAccessCreateWithoutAssetInput, Prisma.FamilyAccessUncheckedCreateWithoutAssetInput>;
};
export type FamilyAccessCreateManyAssetInputEnvelope = {
    data: Prisma.FamilyAccessCreateManyAssetInput | Prisma.FamilyAccessCreateManyAssetInput[];
    skipDuplicates?: boolean;
};
export type FamilyAccessUpsertWithWhereUniqueWithoutAssetInput = {
    where: Prisma.FamilyAccessWhereUniqueInput;
    update: Prisma.XOR<Prisma.FamilyAccessUpdateWithoutAssetInput, Prisma.FamilyAccessUncheckedUpdateWithoutAssetInput>;
    create: Prisma.XOR<Prisma.FamilyAccessCreateWithoutAssetInput, Prisma.FamilyAccessUncheckedCreateWithoutAssetInput>;
};
export type FamilyAccessUpdateWithWhereUniqueWithoutAssetInput = {
    where: Prisma.FamilyAccessWhereUniqueInput;
    data: Prisma.XOR<Prisma.FamilyAccessUpdateWithoutAssetInput, Prisma.FamilyAccessUncheckedUpdateWithoutAssetInput>;
};
export type FamilyAccessUpdateManyWithWhereWithoutAssetInput = {
    where: Prisma.FamilyAccessScalarWhereInput;
    data: Prisma.XOR<Prisma.FamilyAccessUpdateManyMutationInput, Prisma.FamilyAccessUncheckedUpdateManyWithoutAssetInput>;
};
export type FamilyAccessCreateManyParent_userInput = {
    id?: string;
    family_user_id: string;
    asset_id: string;
    access_expiry?: Date | string | null;
    can_edit?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type FamilyAccessCreateManyFamily_userInput = {
    id?: string;
    parent_user_id: string;
    asset_id: string;
    access_expiry?: Date | string | null;
    can_edit?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type FamilyAccessUpdateWithoutParent_userInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    access_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    can_edit?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    family_user?: Prisma.UserUpdateOneRequiredWithoutFamily_access_as_familyNestedInput;
    asset?: Prisma.AssetUpdateOneRequiredWithoutFamily_accessNestedInput;
};
export type FamilyAccessUncheckedUpdateWithoutParent_userInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    family_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    asset_id?: Prisma.StringFieldUpdateOperationsInput | string;
    access_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    can_edit?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FamilyAccessUncheckedUpdateManyWithoutParent_userInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    family_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    asset_id?: Prisma.StringFieldUpdateOperationsInput | string;
    access_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    can_edit?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FamilyAccessUpdateWithoutFamily_userInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    access_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    can_edit?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    parent_user?: Prisma.UserUpdateOneRequiredWithoutFamily_access_as_parentNestedInput;
    asset?: Prisma.AssetUpdateOneRequiredWithoutFamily_accessNestedInput;
};
export type FamilyAccessUncheckedUpdateWithoutFamily_userInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    parent_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    asset_id?: Prisma.StringFieldUpdateOperationsInput | string;
    access_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    can_edit?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FamilyAccessUncheckedUpdateManyWithoutFamily_userInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    parent_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    asset_id?: Prisma.StringFieldUpdateOperationsInput | string;
    access_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    can_edit?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FamilyAccessCreateManyAssetInput = {
    id?: string;
    parent_user_id: string;
    family_user_id: string;
    access_expiry?: Date | string | null;
    can_edit?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type FamilyAccessUpdateWithoutAssetInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    access_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    can_edit?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    parent_user?: Prisma.UserUpdateOneRequiredWithoutFamily_access_as_parentNestedInput;
    family_user?: Prisma.UserUpdateOneRequiredWithoutFamily_access_as_familyNestedInput;
};
export type FamilyAccessUncheckedUpdateWithoutAssetInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    parent_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    family_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    access_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    can_edit?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FamilyAccessUncheckedUpdateManyWithoutAssetInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    parent_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    family_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    access_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    can_edit?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FamilyAccessSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    parent_user_id?: boolean;
    family_user_id?: boolean;
    asset_id?: boolean;
    access_expiry?: boolean;
    can_edit?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    parent_user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    family_user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    asset?: boolean | Prisma.AssetDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["familyAccess"]>;
export type FamilyAccessSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    parent_user_id?: boolean;
    family_user_id?: boolean;
    asset_id?: boolean;
    access_expiry?: boolean;
    can_edit?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    parent_user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    family_user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    asset?: boolean | Prisma.AssetDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["familyAccess"]>;
export type FamilyAccessSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    parent_user_id?: boolean;
    family_user_id?: boolean;
    asset_id?: boolean;
    access_expiry?: boolean;
    can_edit?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    parent_user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    family_user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    asset?: boolean | Prisma.AssetDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["familyAccess"]>;
export type FamilyAccessSelectScalar = {
    id?: boolean;
    parent_user_id?: boolean;
    family_user_id?: boolean;
    asset_id?: boolean;
    access_expiry?: boolean;
    can_edit?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
};
export type FamilyAccessOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "parent_user_id" | "family_user_id" | "asset_id" | "access_expiry" | "can_edit" | "created_at" | "updated_at", ExtArgs["result"]["familyAccess"]>;
export type FamilyAccessInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    parent_user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    family_user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    asset?: boolean | Prisma.AssetDefaultArgs<ExtArgs>;
};
export type FamilyAccessIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    parent_user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    family_user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    asset?: boolean | Prisma.AssetDefaultArgs<ExtArgs>;
};
export type FamilyAccessIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    parent_user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    family_user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    asset?: boolean | Prisma.AssetDefaultArgs<ExtArgs>;
};
export type $FamilyAccessPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "FamilyAccess";
    objects: {
        parent_user: Prisma.$UserPayload<ExtArgs>;
        family_user: Prisma.$UserPayload<ExtArgs>;
        asset: Prisma.$AssetPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        parent_user_id: string;
        family_user_id: string;
        asset_id: string;
        access_expiry: Date | null;
        can_edit: boolean;
        created_at: Date;
        updated_at: Date;
    }, ExtArgs["result"]["familyAccess"]>;
    composites: {};
};
export type FamilyAccessGetPayload<S extends boolean | null | undefined | FamilyAccessDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$FamilyAccessPayload, S>;
export type FamilyAccessCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<FamilyAccessFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: FamilyAccessCountAggregateInputType | true;
};
export interface FamilyAccessDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['FamilyAccess'];
        meta: {
            name: 'FamilyAccess';
        };
    };
    /**
     * Find zero or one FamilyAccess that matches the filter.
     * @param {FamilyAccessFindUniqueArgs} args - Arguments to find a FamilyAccess
     * @example
     * // Get one FamilyAccess
     * const familyAccess = await prisma.familyAccess.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FamilyAccessFindUniqueArgs>(args: Prisma.SelectSubset<T, FamilyAccessFindUniqueArgs<ExtArgs>>): Prisma.Prisma__FamilyAccessClient<runtime.Types.Result.GetResult<Prisma.$FamilyAccessPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one FamilyAccess that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FamilyAccessFindUniqueOrThrowArgs} args - Arguments to find a FamilyAccess
     * @example
     * // Get one FamilyAccess
     * const familyAccess = await prisma.familyAccess.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FamilyAccessFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, FamilyAccessFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__FamilyAccessClient<runtime.Types.Result.GetResult<Prisma.$FamilyAccessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first FamilyAccess that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FamilyAccessFindFirstArgs} args - Arguments to find a FamilyAccess
     * @example
     * // Get one FamilyAccess
     * const familyAccess = await prisma.familyAccess.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FamilyAccessFindFirstArgs>(args?: Prisma.SelectSubset<T, FamilyAccessFindFirstArgs<ExtArgs>>): Prisma.Prisma__FamilyAccessClient<runtime.Types.Result.GetResult<Prisma.$FamilyAccessPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first FamilyAccess that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FamilyAccessFindFirstOrThrowArgs} args - Arguments to find a FamilyAccess
     * @example
     * // Get one FamilyAccess
     * const familyAccess = await prisma.familyAccess.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FamilyAccessFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, FamilyAccessFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__FamilyAccessClient<runtime.Types.Result.GetResult<Prisma.$FamilyAccessPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more FamilyAccesses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FamilyAccessFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FamilyAccesses
     * const familyAccesses = await prisma.familyAccess.findMany()
     *
     * // Get first 10 FamilyAccesses
     * const familyAccesses = await prisma.familyAccess.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const familyAccessWithIdOnly = await prisma.familyAccess.findMany({ select: { id: true } })
     *
     */
    findMany<T extends FamilyAccessFindManyArgs>(args?: Prisma.SelectSubset<T, FamilyAccessFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FamilyAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a FamilyAccess.
     * @param {FamilyAccessCreateArgs} args - Arguments to create a FamilyAccess.
     * @example
     * // Create one FamilyAccess
     * const FamilyAccess = await prisma.familyAccess.create({
     *   data: {
     *     // ... data to create a FamilyAccess
     *   }
     * })
     *
     */
    create<T extends FamilyAccessCreateArgs>(args: Prisma.SelectSubset<T, FamilyAccessCreateArgs<ExtArgs>>): Prisma.Prisma__FamilyAccessClient<runtime.Types.Result.GetResult<Prisma.$FamilyAccessPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many FamilyAccesses.
     * @param {FamilyAccessCreateManyArgs} args - Arguments to create many FamilyAccesses.
     * @example
     * // Create many FamilyAccesses
     * const familyAccess = await prisma.familyAccess.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends FamilyAccessCreateManyArgs>(args?: Prisma.SelectSubset<T, FamilyAccessCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many FamilyAccesses and returns the data saved in the database.
     * @param {FamilyAccessCreateManyAndReturnArgs} args - Arguments to create many FamilyAccesses.
     * @example
     * // Create many FamilyAccesses
     * const familyAccess = await prisma.familyAccess.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many FamilyAccesses and only return the `id`
     * const familyAccessWithIdOnly = await prisma.familyAccess.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends FamilyAccessCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, FamilyAccessCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FamilyAccessPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a FamilyAccess.
     * @param {FamilyAccessDeleteArgs} args - Arguments to delete one FamilyAccess.
     * @example
     * // Delete one FamilyAccess
     * const FamilyAccess = await prisma.familyAccess.delete({
     *   where: {
     *     // ... filter to delete one FamilyAccess
     *   }
     * })
     *
     */
    delete<T extends FamilyAccessDeleteArgs>(args: Prisma.SelectSubset<T, FamilyAccessDeleteArgs<ExtArgs>>): Prisma.Prisma__FamilyAccessClient<runtime.Types.Result.GetResult<Prisma.$FamilyAccessPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one FamilyAccess.
     * @param {FamilyAccessUpdateArgs} args - Arguments to update one FamilyAccess.
     * @example
     * // Update one FamilyAccess
     * const familyAccess = await prisma.familyAccess.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends FamilyAccessUpdateArgs>(args: Prisma.SelectSubset<T, FamilyAccessUpdateArgs<ExtArgs>>): Prisma.Prisma__FamilyAccessClient<runtime.Types.Result.GetResult<Prisma.$FamilyAccessPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more FamilyAccesses.
     * @param {FamilyAccessDeleteManyArgs} args - Arguments to filter FamilyAccesses to delete.
     * @example
     * // Delete a few FamilyAccesses
     * const { count } = await prisma.familyAccess.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends FamilyAccessDeleteManyArgs>(args?: Prisma.SelectSubset<T, FamilyAccessDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more FamilyAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FamilyAccessUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FamilyAccesses
     * const familyAccess = await prisma.familyAccess.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends FamilyAccessUpdateManyArgs>(args: Prisma.SelectSubset<T, FamilyAccessUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more FamilyAccesses and returns the data updated in the database.
     * @param {FamilyAccessUpdateManyAndReturnArgs} args - Arguments to update many FamilyAccesses.
     * @example
     * // Update many FamilyAccesses
     * const familyAccess = await prisma.familyAccess.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more FamilyAccesses and only return the `id`
     * const familyAccessWithIdOnly = await prisma.familyAccess.updateManyAndReturn({
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
    updateManyAndReturn<T extends FamilyAccessUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, FamilyAccessUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FamilyAccessPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one FamilyAccess.
     * @param {FamilyAccessUpsertArgs} args - Arguments to update or create a FamilyAccess.
     * @example
     * // Update or create a FamilyAccess
     * const familyAccess = await prisma.familyAccess.upsert({
     *   create: {
     *     // ... data to create a FamilyAccess
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FamilyAccess we want to update
     *   }
     * })
     */
    upsert<T extends FamilyAccessUpsertArgs>(args: Prisma.SelectSubset<T, FamilyAccessUpsertArgs<ExtArgs>>): Prisma.Prisma__FamilyAccessClient<runtime.Types.Result.GetResult<Prisma.$FamilyAccessPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of FamilyAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FamilyAccessCountArgs} args - Arguments to filter FamilyAccesses to count.
     * @example
     * // Count the number of FamilyAccesses
     * const count = await prisma.familyAccess.count({
     *   where: {
     *     // ... the filter for the FamilyAccesses we want to count
     *   }
     * })
    **/
    count<T extends FamilyAccessCountArgs>(args?: Prisma.Subset<T, FamilyAccessCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], FamilyAccessCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a FamilyAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FamilyAccessAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FamilyAccessAggregateArgs>(args: Prisma.Subset<T, FamilyAccessAggregateArgs>): Prisma.PrismaPromise<GetFamilyAccessAggregateType<T>>;
    /**
     * Group by FamilyAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FamilyAccessGroupByArgs} args - Group by arguments.
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
    groupBy<T extends FamilyAccessGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: FamilyAccessGroupByArgs['orderBy'];
    } : {
        orderBy?: FamilyAccessGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, FamilyAccessGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFamilyAccessGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the FamilyAccess model
     */
    readonly fields: FamilyAccessFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for FamilyAccess.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__FamilyAccessClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    parent_user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    family_user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    asset<T extends Prisma.AssetDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.AssetDefaultArgs<ExtArgs>>): Prisma.Prisma__AssetClient<runtime.Types.Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the FamilyAccess model
 */
export interface FamilyAccessFieldRefs {
    readonly id: Prisma.FieldRef<"FamilyAccess", 'String'>;
    readonly parent_user_id: Prisma.FieldRef<"FamilyAccess", 'String'>;
    readonly family_user_id: Prisma.FieldRef<"FamilyAccess", 'String'>;
    readonly asset_id: Prisma.FieldRef<"FamilyAccess", 'String'>;
    readonly access_expiry: Prisma.FieldRef<"FamilyAccess", 'DateTime'>;
    readonly can_edit: Prisma.FieldRef<"FamilyAccess", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"FamilyAccess", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"FamilyAccess", 'DateTime'>;
}
/**
 * FamilyAccess findUnique
 */
export type FamilyAccessFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which FamilyAccess to fetch.
     */
    where: Prisma.FamilyAccessWhereUniqueInput;
};
/**
 * FamilyAccess findUniqueOrThrow
 */
export type FamilyAccessFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which FamilyAccess to fetch.
     */
    where: Prisma.FamilyAccessWhereUniqueInput;
};
/**
 * FamilyAccess findFirst
 */
export type FamilyAccessFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which FamilyAccess to fetch.
     */
    where?: Prisma.FamilyAccessWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FamilyAccesses to fetch.
     */
    orderBy?: Prisma.FamilyAccessOrderByWithRelationInput | Prisma.FamilyAccessOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for FamilyAccesses.
     */
    cursor?: Prisma.FamilyAccessWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FamilyAccesses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FamilyAccesses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of FamilyAccesses.
     */
    distinct?: Prisma.FamilyAccessScalarFieldEnum | Prisma.FamilyAccessScalarFieldEnum[];
};
/**
 * FamilyAccess findFirstOrThrow
 */
export type FamilyAccessFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which FamilyAccess to fetch.
     */
    where?: Prisma.FamilyAccessWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FamilyAccesses to fetch.
     */
    orderBy?: Prisma.FamilyAccessOrderByWithRelationInput | Prisma.FamilyAccessOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for FamilyAccesses.
     */
    cursor?: Prisma.FamilyAccessWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FamilyAccesses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FamilyAccesses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of FamilyAccesses.
     */
    distinct?: Prisma.FamilyAccessScalarFieldEnum | Prisma.FamilyAccessScalarFieldEnum[];
};
/**
 * FamilyAccess findMany
 */
export type FamilyAccessFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which FamilyAccesses to fetch.
     */
    where?: Prisma.FamilyAccessWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FamilyAccesses to fetch.
     */
    orderBy?: Prisma.FamilyAccessOrderByWithRelationInput | Prisma.FamilyAccessOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing FamilyAccesses.
     */
    cursor?: Prisma.FamilyAccessWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FamilyAccesses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FamilyAccesses.
     */
    skip?: number;
    distinct?: Prisma.FamilyAccessScalarFieldEnum | Prisma.FamilyAccessScalarFieldEnum[];
};
/**
 * FamilyAccess create
 */
export type FamilyAccessCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a FamilyAccess.
     */
    data: Prisma.XOR<Prisma.FamilyAccessCreateInput, Prisma.FamilyAccessUncheckedCreateInput>;
};
/**
 * FamilyAccess createMany
 */
export type FamilyAccessCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many FamilyAccesses.
     */
    data: Prisma.FamilyAccessCreateManyInput | Prisma.FamilyAccessCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * FamilyAccess createManyAndReturn
 */
export type FamilyAccessCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FamilyAccess
     */
    select?: Prisma.FamilyAccessSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the FamilyAccess
     */
    omit?: Prisma.FamilyAccessOmit<ExtArgs> | null;
    /**
     * The data used to create many FamilyAccesses.
     */
    data: Prisma.FamilyAccessCreateManyInput | Prisma.FamilyAccessCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FamilyAccessIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * FamilyAccess update
 */
export type FamilyAccessUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a FamilyAccess.
     */
    data: Prisma.XOR<Prisma.FamilyAccessUpdateInput, Prisma.FamilyAccessUncheckedUpdateInput>;
    /**
     * Choose, which FamilyAccess to update.
     */
    where: Prisma.FamilyAccessWhereUniqueInput;
};
/**
 * FamilyAccess updateMany
 */
export type FamilyAccessUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update FamilyAccesses.
     */
    data: Prisma.XOR<Prisma.FamilyAccessUpdateManyMutationInput, Prisma.FamilyAccessUncheckedUpdateManyInput>;
    /**
     * Filter which FamilyAccesses to update
     */
    where?: Prisma.FamilyAccessWhereInput;
    /**
     * Limit how many FamilyAccesses to update.
     */
    limit?: number;
};
/**
 * FamilyAccess updateManyAndReturn
 */
export type FamilyAccessUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FamilyAccess
     */
    select?: Prisma.FamilyAccessSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the FamilyAccess
     */
    omit?: Prisma.FamilyAccessOmit<ExtArgs> | null;
    /**
     * The data used to update FamilyAccesses.
     */
    data: Prisma.XOR<Prisma.FamilyAccessUpdateManyMutationInput, Prisma.FamilyAccessUncheckedUpdateManyInput>;
    /**
     * Filter which FamilyAccesses to update
     */
    where?: Prisma.FamilyAccessWhereInput;
    /**
     * Limit how many FamilyAccesses to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FamilyAccessIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * FamilyAccess upsert
 */
export type FamilyAccessUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the FamilyAccess to update in case it exists.
     */
    where: Prisma.FamilyAccessWhereUniqueInput;
    /**
     * In case the FamilyAccess found by the `where` argument doesn't exist, create a new FamilyAccess with this data.
     */
    create: Prisma.XOR<Prisma.FamilyAccessCreateInput, Prisma.FamilyAccessUncheckedCreateInput>;
    /**
     * In case the FamilyAccess was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.FamilyAccessUpdateInput, Prisma.FamilyAccessUncheckedUpdateInput>;
};
/**
 * FamilyAccess delete
 */
export type FamilyAccessDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which FamilyAccess to delete.
     */
    where: Prisma.FamilyAccessWhereUniqueInput;
};
/**
 * FamilyAccess deleteMany
 */
export type FamilyAccessDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which FamilyAccesses to delete
     */
    where?: Prisma.FamilyAccessWhereInput;
    /**
     * Limit how many FamilyAccesses to delete.
     */
    limit?: number;
};
/**
 * FamilyAccess without action
 */
export type FamilyAccessDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=FamilyAccess.d.ts.map