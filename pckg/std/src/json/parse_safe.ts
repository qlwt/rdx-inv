import { MNONE } from "#src/maybe/cst/mnone";
import { maybe_new_some } from "#src/maybe/new/some";
import type { Maybe } from "#src/maybe/type/maybe";

export const json_parse_safe = function (src: string): Maybe<any> {
    try {
        return maybe_new_some(JSON.parse(src))
    } catch (e) {
        return MNONE
    }
}
