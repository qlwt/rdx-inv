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

export type RemSliceDef<Key extends RemKey> = {
    readonly slice: RemSlice<Key>

    readonly thunk_hmap: {
        readonly post: rtk.AsyncThunk<capi.SendPost_Result<Key>, capi.SendPost_Params<Key>, rtk.AsyncThunkConfig>
        readonly patch: rtk.AsyncThunk<capi.SendPatch_Result<Key>, capi.SendPatch_Params<Key>, rtk.AsyncThunkConfig>
        readonly delete: rtk.AsyncThunk<capi.SendDelete_Result<Key>, capi.SendDelete_Params<Key>, rtk.AsyncThunkConfig>
        readonly load: rtk.AsyncThunk<capi.SendMGet_Result<Key>, capi.SendMGet_Params<Key>, rtk.AsyncThunkConfig>
        readonly pagload: rtk.AsyncThunk<capi.SendMGet_Result<Key>, capi.SendMGet_Params<Key>, rtk.AsyncThunkConfig>
    }
}
