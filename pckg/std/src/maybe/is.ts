import type { Maybe } from "#src/maybe/type/maybe";

export const maybe_is = function <T>(src: Maybe<T>, value: T) {
    if (src.kind) {
        return src.value === value
    }

    return false
}
