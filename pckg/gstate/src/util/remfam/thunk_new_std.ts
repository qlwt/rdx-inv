import type { RemKey } from "#src/type/rem";
import { gevent_def_remslice } from "#src/util/gevent/def/remslice";
import type { RemSlice_ThunkDefStd } from "#src/util/remfam/type/slice";
import * as rtk from "@reduxjs/toolkit";
import * as capi from "@ta/capi";
import * as std from "@ta/std";

export const remfam_thunk_new_std = function <Key extends RemKey>(key: Key): RemSlice_ThunkDefStd<Key> {
    const reqmap = new Map<string, VoidFunction>()

    return {
        reqmap,

        act: {
            delete: rtk.createAsyncThunk(
                `${key}/delete`,
                async (params: capi.SendDelete_Params<Key>, api) => {
                    return await capi.send_delete(key, {
                        ...params,

                        config: {
                            ...params.config,

                            abort_signal: std.abort_signal_new_merge([
                                params.config?.abort_signal,
                                api.signal,
                            ]),
                        },
                    })
                },
            ),

            post: rtk.createAsyncThunk(
                `${key}/post`,
                async (params: capi.SendPost_Params<Key>, api) => {
                    return await capi.send_post(key, {
                        ...params,

                        config: {
                            ...params.config,

                            abort_signal: std.abort_signal_new_merge([
                                params.config?.abort_signal,
                                api.signal,
                            ]),
                        },
                    })
                },
            ),

            patch: rtk.createAsyncThunk(
                `${key}/patch`,
                async (params: capi.SendPatch_Params<Key>, api) => {
                    reqmap.set(api.requestId, api.abort)

                    return await capi.send_patch(key, {
                        ...params,

                        config: {
                            ...params.config,

                            abort_signal: std.abort_signal_new_merge([
                                params.config?.abort_signal,
                                api.signal,
                            ]),
                        },
                    })
                },
            ),

            pagload: rtk.createAsyncThunk(
                `${key}/pagload`,
                async (params: capi.SendMGet_Params<Key>, api) => {
                    const result = await capi.send_mget(key, {
                        ...params,

                        config: {
                            ...params.config,

                            abort_signal: std.abort_signal_new_merge([
                                params.config?.abort_signal,
                                api.signal,
                            ]),
                        },
                    })

                    if (result.success) {
                        api.dispatch(gevent_def_remslice({
                            slice: result.body.slice
                        }))
                    }

                    return result
                },
            ),

            load: rtk.createAsyncThunk(
                `${key}/load`,
                async (params: capi.SendMGet_Params<Key>, api) => {
                    const result = await capi.send_mget(key, {
                        ...params,

                        config: {
                            ...params.config,

                            abort_signal: std.abort_signal_new_merge([
                                params.config?.abort_signal,
                                api.signal,
                            ]),
                        },
                    })

                    if (result.success) {
                        api.dispatch(gevent_def_remslice({
                            slice: result.body.slice
                        }))
                    }

                    return result
                },
            ),
        },
    }
}
