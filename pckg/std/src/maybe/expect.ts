import type { Maybe } from "#src/maybe/type/maybe";

export const maybe_expect = function <T>(src: Maybe<T>): T {
    if (src.kind === false) {
        throw new Error(`Expected Maybe to contain value, but None is found`)
    }

    return src.value
}
