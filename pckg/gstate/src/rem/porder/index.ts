import { rem_porder__middle_new_derived_product } from "#src/rem/porder/middle/new/derived_product"
import { rem_porder__slicedef } from "#src/rem/porder/slicedef"
import { rem_porder__thunk_std } from "#src/rem/porder/thunk/std"

export const rem_porder = {
    reducer: rem_porder__slicedef.slice.reducer,

    middle: {
        derived_product: rem_porder__middle_new_derived_product(),
    },

    act: {
        ...rem_porder__slicedef.slice.actions,
        ...rem_porder__thunk_std.act,
    },

    sel: {
        ...rem_porder__slicedef.slice.selectors,
    },
}
