import { rem_porder__thunk_std } from "#src/rem/porder/thunk/std";
import { remfam_slice_new } from "#src/util/remfam/slice_new";
import * as rtk from "@reduxjs/toolkit";

const patchadd_key_list = [
    "product_price_uah",
    "product_price_usd",
    "product_count",
] as const

type APatchAdd = {
    readonly id: string

    readonly patch: {
        readonly [K in (typeof patchadd_key_list)[number]]?: number
    }
}

export const rem_porder__slicedef = remfam_slice_new("porder", {
    thunk_std: rem_porder__thunk_std,

    reducer_hmap: {
        path_add: (state, { payload }: rtk.PayloadAction<APatchAdd>) => {
            const entity = state.ent.entities[payload.id]

            if (entity) {
                for (const key of patchadd_key_list) {
                    if (key in payload.patch) {
                        entity[key] += payload.patch[key]!
                    }
                }
            }
        },
    },
})
