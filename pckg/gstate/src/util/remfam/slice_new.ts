import type { RemKey, RemNode } from "#src/type/rem"
import { gevent_def_remslice } from "#src/util/gevent/def/remslice"
import type { RemFam } from "#src/util/remfam/type/fam"
import type { RemSlice_ThunkDefStd, RemSliceDef } from "#src/util/remfam/type/slice"
import { remlog_node_new_wr } from "#src/util/remlog/node_new"
import { rempag_node_new } from "#src/util/rempag/node_new"
import * as rtk from "@reduxjs/toolkit"
import * as capi from "@ta/capi"
import type * as rest from "@ta/rest"
import * as std from "@ta/std"
import { v7 as uuid_new } from "uuid"

const NAME_PATCH = "MAJOR_PATCH"

export type RemFam_Slice_New_Params<
    Key extends RemKey,
    CaseReducers extends rtk.SliceCaseReducers<RemFam<Key>>
> = {
    readonly thunk_std: RemSlice_ThunkDefStd<Key>
    readonly adapter: rtk.EntityAdapter<RemNode<Key>, string>
    readonly reducer_hmap: rtk.ValidateSliceCaseReducers<RemFam<Key>, CaseReducers>
    readonly reducer_extra_add?: (builder: rtk.ActionReducerMapBuilder<RemFam<Key>>) => void

    readonly node_new_post: (id: string, body: capi.SendPost_Body<Key>) => rest.DatabaseOut[Key]
}

export const remfam_slice_new = function <
    Key extends RemKey,
    CaseReducers extends rtk.SliceCaseReducers<RemFam<Key>>
>(key: Key, params: RemFam_Slice_New_Params<Key, CaseReducers>): RemSliceDef<Key, CaseReducers> {
    const { thunk_std, adapter } = params

    return {
        adapter,

        slice: rtk.createSlice({
            name: key,

            initialState: {
                rempag: {},
                remlog: {},
                ent: adapter.getInitialState(),
            } satisfies RemFam<Key> as RemFam<Key>,

            reducers: params.reducer_hmap,

            extraReducers: builder => {
                if (params.reducer_extra_add) {
                    params.reducer_extra_add(builder)
                }

                return (builder
                    .addCase(gevent_def_remslice, (state, { payload }) => {
                        const node_list = payload.slice[key]

                        if (node_list) {
                            adapter.addMany(state.ent, node_list)
                        }
                    })
                    .addCase(thunk_std.act.pagload.pending, (state, action) => {
                        const paghash = std.object_hash_stable(action.meta.arg.query.pick ?? {})
                        const pagnode = state.rempag[paghash]

                        if (pagnode) {
                            pagnode.status_pending = true
                        } else {
                            state.rempag[paghash] = rempag_node_new()
                        }
                    })
                    .addCase(thunk_std.act.pagload.rejected, (state, { meta }) => {
                        const paghash = std.object_hash_stable(meta.arg.query.pick ?? {})
                        const pagnode = state.rempag[paghash]!

                        pagnode.status_pending = false
                    })
                    .addCase(thunk_std.act.pagload.fulfilled, (state, { payload, meta }) => {
                        const paghash = std.object_hash_stable(meta.arg.query.pick ?? {})
                        const pagnode = state.rempag[paghash]!

                        {
                            pagnode.status_pending = false
                        }

                        if (payload.success) {
                            pagnode.count_total = std.maybe_new_some(payload.body.count)
                            pagnode.cursor = std.maybe_new_some(payload.body.cursor)
                        }
                    })

                    // PATCH
                    .addCase(thunk_std.act.patch.pending, (state, { meta }) => {
                        const node_id = meta.arg.url.id
                        const node_remlog = std.object_upsert_lazy(state.remlog, node_id, remlog_node_new_wr)

                        const pending_idx = node_remlog.patch.findIndex(n => n.name === NAME_PATCH)

                        if (pending_idx !== -1) {
                            thunk_std.reqmap.get(node_remlog.patch[pending_idx]!.req_id)?.()

                            node_remlog.patch.splice(pending_idx, 1)
                        }

                        node_remlog.patch.push({
                            name: NAME_PATCH,
                            req_id: meta.requestId,
                            data: meta.arg.body satisfies Partial<RemNode<"product">> as any,
                        })
                    })
                    .addCase(thunk_std.act.patch.rejected, (state, { meta }) => {
                        const node_id = meta.arg.url.id
                        const node_remlog = std.object_upsert_lazy(state.remlog, node_id, remlog_node_new_wr)

                        thunk_std.reqmap.delete(meta.requestId)

                        const pending_idx = node_remlog.patch.findIndex(n => n.req_id === meta.requestId)

                        if (pending_idx !== -1) {
                            node_remlog.patch.splice(pending_idx, 1)
                        }
                    })
                    .addCase(thunk_std.act.patch.fulfilled, (state, { meta, payload }) => {
                        const node_id = meta.arg.url.id
                        const node_remlog = std.object_upsert_lazy(state.remlog, node_id, remlog_node_new_wr)

                        thunk_std.reqmap.delete(meta.requestId)

                        const pending_idx = node_remlog.patch.findIndex(n => n.req_id === meta.requestId)

                        if (pending_idx !== -1) {
                            const patch_node = node_remlog.patch[pending_idx]!

                            if (payload.success) {
                                adapter.updateOne(state.ent, {
                                    id: node_id,
                                    changes: patch_node.data as Partial<RemNode<Key>>,
                                })
                            }

                            node_remlog.patch.splice(pending_idx, 1)
                        }
                    })

                    // DELETE
                    .addCase(thunk_std.act.delete.pending, (state, { meta, }) => {
                        const node_id = meta.arg.url.id
                        const node_remlog = std.object_upsert_lazy(state.remlog, node_id, remlog_node_new_wr)

                        node_remlog.del.push({
                            req_id: meta.requestId,
                        })
                    })
                    .addCase(thunk_std.act.delete.rejected, (state, { meta }) => {
                        const node_id = meta.arg.url.id
                        const node_remlog = std.object_upsert_lazy(state.remlog, node_id, remlog_node_new_wr)

                        node_remlog.del = node_remlog.del.filter(remlog_del => {
                            return remlog_del.req_id !== meta.requestId
                        })
                    })
                    .addCase(thunk_std.act.delete.fulfilled, (state, { meta, payload }) => {
                        const node_id = meta.arg.url.id
                        const node_remlog = std.object_upsert_lazy(state.remlog, node_id, remlog_node_new_wr)

                        node_remlog.del = node_remlog.del.filter(remlog_del => {
                            return remlog_del.req_id !== meta.requestId
                        })

                        if (payload.success) {
                            adapter.removeOne(state.ent, node_id)
                        }
                    })

                    // POST
                    .addCase(thunk_std.act.post.pending, (state, { meta, }) => {
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

                        adapter.addOne(state.ent, params.node_new_post(node_id, meta.arg.body))
                    })
                    .addCase(thunk_std.act.post.rejected, (state, { meta, }) => {
                        const temp_remlog = std.object_upsert_lazy(state.remlog, meta.requestId, remlog_node_new_wr)
                        const log_temp = temp_remlog.post

                        if (log_temp) {
                            const node_id = log_temp.node_id

                            delete state.remlog[node_id]
                            delete state.remlog[meta.requestId]

                            adapter.removeOne(state.ent, node_id)
                        }
                    })
                    .addCase(thunk_std.act.post.fulfilled, (state, { meta, payload }) => {
                        const temp_remlog = std.object_upsert_lazy(state.remlog, meta.requestId, remlog_node_new_wr)
                        const log_temp = temp_remlog.post

                        if (log_temp) {
                            const node_id = log_temp.node_id
                            const temp_remnode = state.ent.entities[node_id]

                            delete state.remlog[node_id]
                            delete state.remlog[meta.requestId]

                            if (temp_remnode) {
                                adapter.removeOne(state.ent, node_id)

                                if (payload.success) {
                                    adapter.addOne(state.ent, {
                                        ...temp_remnode,

                                        id: payload.body.id,
                                        created_at: payload.body.created_at,
                                    } as RemNode<Key>)
                                }
                            }
                        }
                    })
                )
            },

            selectors: {
                ...adapter.getSelectors((state: RemFam<Key>) => state.ent),
            },
        }),
    }
}
