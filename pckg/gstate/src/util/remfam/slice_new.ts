import type { RemKey, RemNode } from "#src/type/rem"
import type { RemFam } from "#src/util/remfam/type/fam"
import type { RemSliceDef } from "#src/util/remfam/type/slice"
import { remlog_node_new_wr } from "#src/util/remlog/node_new"
import { rempag_node_new } from "#src/util/rempag/node_new"
import * as rtk from "@reduxjs/toolkit"
import * as capi from "@ta/capi"
import * as std from "@ta/std"
import { v7 as uuid_new } from "uuid"

export const remfam_slice_new = function <Key extends RemKey>(key: Key): RemSliceDef<Key> {
    const reqmap = new Map<string, VoidFunction>()

    const adapter = rtk.createEntityAdapter({
        selectId: (node: RemNode<Key>) => node.id,
        sortComparer: (a, b) => -a.id.localeCompare(b.id),
    })

    const thunk_load = rtk.createAsyncThunk(
        `${key}/load`,
        async (params: capi.SendMGet_Params<Key>, api) => {
            return await capi.send_mget(key, {
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
    )

    const thunk_pagload = rtk.createAsyncThunk(
        `${key}/pagload`,
        async (params: capi.SendMGet_Params<Key>, api) => {
            return await capi.send_mget(key, {
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
    )

    const thunk_patch = rtk.createAsyncThunk(
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
    )

    const thunk_delete = rtk.createAsyncThunk(
        `${key}/delete`,
        async (params: capi.SendDelete_Params<Key>, api) => {
            reqmap.set(api.requestId, api.abort)

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
    )

    const thunk_post = rtk.createAsyncThunk(
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
    )

    return {
        thunk_hmap: {
            load: thunk_load,
            pagload: thunk_pagload,

            post: thunk_post,
            patch: thunk_patch,
            delete: thunk_delete,
        } as any,

        slice: rtk.createSlice({
            name: key,

            initialState: {
                rempag: {},
                remlog: {},
                ent: adapter.getInitialState(),
            } satisfies RemFam<Key> as RemFam<Key>,

            reducers: {
            },

            extraReducers: builder => (builder
                .addCase(thunk_load.fulfilled, (state, { payload }) => {
                    if (payload.success) {
                        adapter.addMany(state.ent, payload.body.node_list)
                    }
                })
                .addCase(thunk_pagload.pending, (state, action) => {
                    const paghash = std.object_hash_stable(action.meta.arg.query.pick ?? {})
                    const pagnode = state.rempag[paghash]

                    if (pagnode) {
                        pagnode.status_pending = true
                    } else {
                        state.rempag[paghash] = rempag_node_new()
                    }
                })
                .addCase(thunk_pagload.rejected, (state, { meta }) => {
                    const paghash = std.object_hash_stable(meta.arg.query.pick ?? {})
                    const pagnode = state.rempag[paghash]!

                    pagnode.status_pending = false
                })
                .addCase(thunk_pagload.fulfilled, (state, { payload, meta }) => {
                    const paghash = std.object_hash_stable(meta.arg.query.pick ?? {})
                    const pagnode = state.rempag[paghash]!

                    {
                        pagnode.status_pending = false
                    }

                    if (payload.success) {
                        pagnode.count_total = std.maybe_new_some(payload.body.count)
                        pagnode.cursor = std.maybe_new_some(payload.body.cursor)
                        adapter.addMany(state.ent, payload.body.node_list)
                    }
                })

                // PATCH
                .addCase(thunk_patch.pending, (state, { meta }) => {
                    const node_id = meta.arg.url.id

                    const node_remlog = std.object_upsert_lazy(state.remlog, node_id, remlog_node_new_wr)

                    if (node_remlog.patch) {
                        reqmap.get(node_remlog.patch.req_id)?.()
                    }

                    node_remlog.patch = {
                        req_id: meta.requestId,
                        data: meta.arg.body satisfies Partial<RemNode<"product">> as any,
                    }
                })
                .addCase(thunk_patch.rejected, (state, { meta }) => {
                    const node_id = meta.arg.url.id
                    const node_remlog = std.object_upsert_lazy(state.remlog, node_id, remlog_node_new_wr)

                    reqmap.delete(meta.requestId)

                    if (node_remlog.patch?.req_id === meta.requestId) {
                        node_remlog.patch = null
                    }
                })
                .addCase(thunk_patch.fulfilled, (state, { meta, payload }) => {
                    const node_id = meta.arg.url.id
                    const node_remlog = std.object_upsert_lazy(state.remlog, node_id, remlog_node_new_wr)

                    node_remlog.patch = null
                    reqmap.delete(meta.requestId)

                    if (payload.success) {
                        adapter.updateOne(state.ent, {
                            id: node_id,
                            changes: meta.arg.body satisfies Partial<RemNode<"product">> as Partial<RemNode<"product">>,
                        })
                    }
                })

                // DELETE
                .addCase(thunk_delete.pending, (state, { meta, }) => {
                    const node_id = meta.arg.url.id
                    const node_remlog = std.object_upsert_lazy(state.remlog, node_id, remlog_node_new_wr)

                    if (node_remlog.del) {
                        reqmap.get(node_remlog.del.req_id)?.()
                    }

                    node_remlog.del = {
                        req_id: meta.requestId,
                    }
                })
                .addCase(thunk_delete.rejected, (state, { meta }) => {
                    const node_id = meta.arg.url.id
                    const node_remlog = std.object_upsert_lazy(state.remlog, node_id, remlog_node_new_wr)

                    reqmap.delete(meta.requestId)

                    if (node_remlog.del?.req_id === meta.requestId) {
                        node_remlog.del = null
                    }
                })
                .addCase(thunk_delete.fulfilled, (state, { meta, payload }) => {
                    const node_id = meta.arg.url.id
                    const node_remlog = std.object_upsert_lazy(state.remlog, node_id, remlog_node_new_wr)

                    node_remlog.del = null
                    reqmap.delete(meta.requestId)

                    if (payload.success) {
                        adapter.removeOne(state.ent, node_id)
                    }
                })

                // POST
                .addCase(thunk_post.pending, (state, { meta, }) => {
                    const node_id = uuid_new()
                    const node_remlog = std.object_upsert_lazy(state.remlog, node_id, remlog_node_new_wr)
                    const temp_remlog = std.object_upsert_lazy(state.remlog, meta.requestId, remlog_node_new_wr)

                    temp_remlog.post = {
                        req_id: meta.requestId,
                        node_id,
                    }

                    node_remlog.post = {
                        req_id: meta.requestId,
                        node_id,
                    }

                    adapter.addOne(state.ent, {
                        ...meta.arg.body,

                        id: node_id,
                        deleted_at: null,
                        created_at: Date.now(),
                    } as RemNode<"product">)
                })
                .addCase(thunk_post.rejected, (state, { meta, }) => {
                    const temp_remlog = std.object_upsert_lazy(state.remlog, meta.requestId, remlog_node_new_wr)
                    const log_temp = temp_remlog.post

                    if (log_temp) {
                        const node_id = log_temp.node_id

                        delete state.remlog[node_id]
                        delete state.remlog[meta.requestId]

                        adapter.removeOne(state.ent, node_id)
                    }
                })
                .addCase(thunk_post.fulfilled, (state, { meta, payload }) => {
                    const temp_remlog = std.object_upsert_lazy(state.remlog, meta.requestId, remlog_node_new_wr)
                    const log_temp = temp_remlog.post


                    if (log_temp) {
                        const node_id = log_temp.node_id

                        delete state.remlog[node_id]
                        delete state.remlog[meta.requestId]

                        adapter.removeOne(state.ent, node_id)

                        if (payload.success) {
                            adapter.addOne(state.ent, {
                                ...meta.arg.body,

                                deleted_at: null,
                                id: payload.body.id,
                                created_at: payload.body.created_at,
                            } as RemNode<"product">)
                        }
                    }
                })
            ),

            selectors: {
                ...adapter.getSelectors((state: RemFam<Key>) => state.ent),
            },
        }),
    }
}
