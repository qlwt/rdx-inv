import { remfam_slice_new } from "#src/util/remfam/slice_new"

const slicedef = remfam_slice_new("product")

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
