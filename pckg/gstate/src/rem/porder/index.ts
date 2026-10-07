import { rem_porder__thunk_std } from "#src/rem/porder/thunk/std"
import { remfam_slice_new } from "#src/util/remfam/slice_new"

const slicedef = remfam_slice_new("porder", {
    thunk_std: rem_porder__thunk_std,
})

export const rem_porder = {
    reducer: slicedef.slice.reducer,

    act: {
        ...slicedef.slice.actions,
        ...rem_porder__thunk_std.act,
    },

    sel: {
        ...slicedef.slice.selectors,
    },
}
