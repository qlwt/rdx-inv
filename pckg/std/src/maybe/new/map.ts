import type { FnOutTransformer } from "#src/fn/type/commons";
import { maybe_new_none } from "#src/maybe/new/none";
import { maybe_new_some } from "#src/maybe/new/some";
import type { Maybe, MaybeMut } from "#src/maybe/type/maybe";

export const maybe_new_map = function <I, O>(src: Maybe<I>, transformer: FnOutTransformer<I, O>): MaybeMut<O> {
    if (src.kind === false) {
        return maybe_new_none()
    }

    return maybe_new_some(transformer(src.value))
}
