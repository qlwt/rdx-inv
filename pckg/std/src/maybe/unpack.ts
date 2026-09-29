import type { Maybe } from "#src/maybe/type/maybe";

export const maybe_unpack = function <T, F>(src: Maybe<T>, fallback: F): T | F {
    if (src.kind === false) {
        return fallback
    }

    return src.value
}
