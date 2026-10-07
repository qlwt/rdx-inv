import type { RemKey, RemNode } from "#src/type/rem";
import type { RemFam } from "#src/util/remfam/type/fam";
import type * as rtk from "@reduxjs/toolkit";
import type * as capi from "@ta/capi";

export type RemSlice<Key extends RemKey> = rtk.Slice<
    RemFam<Key>,
    {},
    Key,
    Key,
    (
        & rtk.SliceSelectors<RemFam<Key>>
        & rtk.EntitySelectors<RemNode<Key>, RemFam<Key>, string>
    )
>

export type RemSlice_ThunkDefStd<Key extends RemKey> = {
    readonly reqmap: Map<string, VoidFunction>

    readonly act: {
        readonly post: rtk.AsyncThunk<
            capi.ApiResponse<capi.SendPost_Result<Key>>,
            capi.SendPost_Params<Key>,
            rtk.AsyncThunkConfig
        >

        readonly patch: rtk.AsyncThunk<
            capi.ApiResponse<capi.SendPatch_Result<Key>>,
            capi.SendPatch_Params<Key>,
            rtk.AsyncThunkConfig
        >

        readonly delete: rtk.AsyncThunk<
            capi.ApiResponse<capi.SendDelete_Result<Key>>,
            capi.SendDelete_Params<Key>,
            rtk.AsyncThunkConfig
        >

        readonly load: rtk.AsyncThunk<
            capi.ApiResponse<capi.SendMGet_Result<Key>>,
            capi.SendMGet_Params<Key>,
            rtk.AsyncThunkConfig
        >

        readonly pagload: rtk.AsyncThunk<
            capi.ApiResponse<capi.SendMGet_Result<Key>>,
            capi.SendMGet_Params<Key>,
            rtk.AsyncThunkConfig
        >
    }
}

export type RemSliceDef<Key extends RemKey> = {
    readonly slice: RemSlice<Key>
    readonly adapter: rtk.EntityAdapter<RemNode<Key>, string>
}
