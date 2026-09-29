import type { MaybeSomeMut } from "#src/maybe/type/maybe";

export const maybe_new_some = function <T>(value: T): MaybeSomeMut<T> {
    return { kind: true, value }
}
