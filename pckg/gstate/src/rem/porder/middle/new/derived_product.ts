import { rview_data_new } from "#src/hook/remview"
import { rem_porder__slicedef } from "#src/rem/porder/slicedef"
import { rem_product__thunk_std } from "#src/rem/product/thunk/std"
import type { State } from "#src/store"
import * as rtk from "@reduxjs/toolkit"

const patch_effect = function(dispatch: rtk.Dispatch, state_past: State, state_next: State, id: string) {
    const ent_past = state_past.product.ent.entities[id]
    const log_past = state_past.product.remlog[id]

    const ent_next = state_next.product.ent.entities[id]
    const log_next = state_next.product.remlog[id]

    if (ent_next && ent_past) {
        const view_past = log_past ? rview_data_new(ent_past, log_past) : ent_past
        const view_next = log_next ? rview_data_new(ent_next, log_next) : ent_next

        if (view_next.porder_id !== view_past.porder_id) {
            if (view_past.porder_id !== null) {
                dispatch(rem_porder__slicedef.slice.actions.path_add({
                    id: view_past.porder_id,

                    patch: {
                        product_count: -1,
                        product_price_uah: -view_past.price_uah,
                        product_price_usd: -view_past.price_usd,
                    },
                }))
            }

            if (view_next.porder_id !== null) {
                dispatch(rem_porder__slicedef.slice.actions.path_add({
                    id: view_next.porder_id,

                    patch: {
                        product_count: 1,
                        product_price_uah: view_next.price_uah,
                        product_price_usd: view_next.price_usd,
                    },
                }))
            }
        } else {
            if (view_next.porder_id !== null) {
                const diff_uah = view_next.price_uah - view_past.price_uah
                const diff_usd = view_next.price_usd - view_past.price_usd

                if (diff_uah !== 0 || diff_usd !== 0) {
                    dispatch(rem_porder__slicedef.slice.actions.path_add({
                        id: view_next.porder_id,

                        patch: {
                            product_price_uah: diff_uah,
                            product_price_usd: diff_usd,
                        },
                    }))
                }
            }
        }
    }
}

export const rem_porder__middle_new_derived_product = function() {
    const middleware = rtk.createListenerMiddleware<State>()

    middleware.startListening({
        actionCreator: rem_product__thunk_std.act.delete.fulfilled,

        effect: ({ meta, payload, }, api) => {
            if (!payload.success) { return }

            const state_past = api.getOriginalState() as State

            const log_past = state_past.product.remlog[meta.arg.url.id]
            const ent_past = state_past.product.ent.entities[meta.arg.url.id]

            if (ent_past) {
                const view_past = log_past ? rview_data_new(ent_past, log_past) : ent_past

                if (view_past.porder_id !== null) {
                    api.dispatch(rem_porder__slicedef.slice.actions.path_add({
                        id: view_past.porder_id,

                        patch: {
                            product_count: -1,
                            product_price_uah: -view_past.price_uah,
                            product_price_usd: -view_past.price_usd,
                        },
                    }))
                }
            }
        },
    })

    middleware.startListening({
        actionCreator: rem_product__thunk_std.act.patch.pending,

        effect: ({ meta, }, api) => {
            const state_next = api.getState() as State
            const state_past = api.getOriginalState() as State
            console.log("middleware::product::patch::pending")

            if (state_next !== state_past) {
                patch_effect(api.dispatch.bind(api), state_past, state_next, meta.arg.url.id)
            }
        },
    })

    middleware.startListening({
        actionCreator: rem_product__thunk_std.act.patch.rejected,

        effect: ({ meta, }, api) => {
            const state_next = api.getState() as State
            const state_past = api.getOriginalState() as State
            console.log("middleware::product::patch::rejected")

            if (state_next !== state_past) {
                patch_effect(api.dispatch.bind(api), state_past, state_next, meta.arg.url.id)
            }
        },
    })

    middleware.startListening({
        actionCreator: rem_product__thunk_std.act.patch.fulfilled,

        effect: ({ meta, payload }, api) => {
            if (payload.success) { return }
            console.log("middleware::product::patch::fulfilled")

            const state_next = api.getState() as State
            const state_past = api.getOriginalState() as State

            if (state_next !== state_past) {
                patch_effect(api.dispatch.bind(api), state_past, state_next, meta.arg.url.id)
            }
        },
    })

    return middleware
}
