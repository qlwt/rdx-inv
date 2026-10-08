import { rem_pgroup__adapter } from "#src/rem/pgroup/adapter"
import { rem_pgroup__thunk_post_img } from "#src/rem/pgroup/thunk/post_img"
import { rem_pgroup__thunk_std } from "#src/rem/pgroup/thunk/std"
import type { RemNode } from "#src/type/rem"
import { remfam_slice_new } from "#src/util/remfam/slice_new"
import { remlog_node_new_wr } from "#src/util/remlog/node_new"
import * as std from "@ta/std"
import * as capi from "@ta/capi"

const NAME_POST_IMG = "PATCH_POST_IMG"
const thunk_std = rem_pgroup__thunk_std

export const rem_pgroup__slicedef = remfam_slice_new("pgroup", {
    reducer_hmap: {},
    adapter: rem_pgroup__adapter,
    thunk_std: rem_pgroup__thunk_std,

    node_new_post: (id, body) => {
        return {
            id,
            url_raw: null,
            deleted_at: null,
            created_at: Date.now(),

            ...body,
        }
    },

    reducer_extra_add: builder => {
        return (builder
            .addCase(rem_pgroup__thunk_post_img.pending, (state, { meta }) => {
                const node_id = meta.arg.url.id
                const node_remlog = std.object_upsert_lazy(state.remlog, node_id, remlog_node_new_wr)

                const pending_idx = node_remlog.patch.findIndex(n => n.name === NAME_POST_IMG)

                if (pending_idx !== -1) {
                    thunk_std.reqmap.get(node_remlog.patch[pending_idx]!.req_id)?.()

                    node_remlog.patch.splice(pending_idx, 1)
                }

                node_remlog.patch.push({
                    name: NAME_POST_IMG,
                    req_id: meta.requestId,

                    data: {
                        url_raw: capi.filedef_uri_new(meta.arg.files_raw.img[0]),
                    },
                })
            })
            .addCase(rem_pgroup__thunk_post_img.rejected, (state, { meta }) => {
                const node_id = meta.arg.url.id
                const node_remlog = std.object_upsert_lazy(state.remlog, node_id, remlog_node_new_wr)

                thunk_std.reqmap.delete(meta.requestId)

                const pending_idx = node_remlog.patch.findIndex(n => n.req_id === meta.requestId)

                if (pending_idx !== -1) {
                    node_remlog.patch.splice(pending_idx, 1)
                }
            })
            .addCase(rem_pgroup__thunk_post_img.fulfilled, (state, { meta, payload }) => {
                const node_id = meta.arg.url.id
                const node_remlog = std.object_upsert_lazy(state.remlog, node_id, remlog_node_new_wr)

                thunk_std.reqmap.delete(meta.requestId)

                const pending_idx = node_remlog.patch.findIndex(n => n.req_id === meta.requestId)

                if (pending_idx !== -1) {
                    const patch_node = node_remlog.patch[pending_idx]!

                    if (payload.success) {
                        rem_pgroup__adapter.updateOne(state.ent, {
                            id: node_id,

                            changes: {
                                ...patch_node.data as Partial<RemNode<"pgroup">>,

                                img_id: payload.body.id,
                            },
                        })
                    }

                    node_remlog.patch.splice(pending_idx, 1)
                }
            })
        )
    },
})
