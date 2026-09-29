import type { Maybe, MaybeSome } from "#src/maybe/type/maybe";

export const maybe_pick = function <T, F>(src: Maybe<T>, fallback: F): MaybeSome<T> | F {
    if (src.kind) {
        return src
    }

    return fallback
}
