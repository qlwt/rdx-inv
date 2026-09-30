import { remfam_slice_new } from "#src/util/remfam/slice_new"

const slicedef = remfam_slice_new("porder")

export const rem_porder = {
    reducer: slicedef.slice.reducer,

    act: {
        ...slicedef.slice.actions,
        ...slicedef.thunk_hmap,
    },

    sel: {
        ...slicedef.slice.selectors,
    },
}
