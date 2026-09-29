import type { MaybeNoneMut } from "#src/maybe/type/maybe";

export const maybe_new_none = function(): MaybeNoneMut {
    return { kind: false, }
}
