import { rem_porder } from "#src/rem/porder"
import { remfam_slice_new } from "#src/util/remfam/slice_new"
import { remlog_node_new_wr } from "#src/util/remlog/node_new"
import * as std from "@ta/std"

const slicedef = remfam_slice_new("product", {
    reducer_extra_add: builder => {
        return (builder
            .addCase(rem_porder.act.delete.pending, (state, { meta, }) => {
                for (const entity of Object.values(state.ent.entities)) {
                    if (entity.porder_id == meta.arg.url.id) {
                        const node_remlog = std.object_upsert_lazy(state.remlog, entity.id, remlog_node_new_wr)

                        node_remlog.del.push({
                            req_id: meta.requestId,
                        })
                    }
                }
            })
            .addCase(rem_porder.act.delete.rejected, (state, { meta, }) => {
                for (const entity of Object.values(state.ent.entities)) {
                    if (entity.porder_id == meta.arg.url.id) {
                        const node_remlog = std.object_upsert_lazy(state.remlog, entity.id, remlog_node_new_wr)

                        node_remlog.del = node_remlog.del.filter(remlog_del => {
                            return remlog_del.req_id !== meta.requestId
                        })
                    }
                }
            })
            .addCase(rem_porder.act.delete.fulfilled, (state, { meta, payload, }) => {
                if (payload.success) {
                    const removal_id_list = new Array<string>()

                    for (const entity of Object.values(state.ent.entities)) {
                        if (entity.porder_id == meta.arg.url.id) {
                            const node_remlog = std.object_upsert_lazy(state.remlog, entity.id, remlog_node_new_wr)

                            node_remlog.del = node_remlog.del.filter(remlog_del => {
                                return remlog_del.req_id !== meta.requestId
                            })

                            removal_id_list.push(entity.id)
                        }
                    }

                    slicedef.adapter.removeMany(state.ent, removal_id_list)
                } else {
                    for (const entity of Object.values(state.ent.entities)) {
                        if (entity.porder_id == meta.arg.url.id) {
                            const node_remlog = std.object_upsert_lazy(state.remlog, entity.id, remlog_node_new_wr)

                            node_remlog.del = node_remlog.del.filter(remlog_del => {
                                return remlog_del.req_id !== meta.requestId
                            })
                        }
                    }
                }
            })
        )
    },
})

export const rem_product = {
    reducer: slicedef.slice.reducer,

    act: {
        ...slicedef.slice.actions,
        ...slicedef.thunk_hmap,
    },

    sel: {
        ...slicedef.slice.selectors,
    },
}
