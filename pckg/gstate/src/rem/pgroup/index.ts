import { rem_pgroup__slicedef } from "#src/rem/pgroup/slicedef"
import { rem_pgroup__thunk_post_img } from "#src/rem/pgroup/thunk/post_img"
import { rem_pgroup__thunk_std } from "#src/rem/pgroup/thunk/std"

export const rem_pgroup = {
    middle: {},
    reducer: rem_pgroup__slicedef.slice.reducer,

    act: {
        ...rem_pgroup__slicedef.slice.actions,
        ...rem_pgroup__thunk_std.act,

        post_img: rem_pgroup__thunk_post_img,
    },

    sel: {
        ...rem_pgroup__slicedef.slice.selectors,
    },
}
