import { rem_product__slicedef } from "#src/rem/product/slicedef"
import { rem_product__thunk_std } from "#src/rem/product/thunk/std"

export const rem_product = {
    middle: {},
    reducer: rem_product__slicedef.slice.reducer,

    act: {
        ...rem_product__slicedef.slice.actions,
        ...rem_product__thunk_std.act,
    },

    sel: {
        ...rem_product__slicedef.slice.selectors,
    },
}
