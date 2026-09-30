import { useSelect } from "#src/hook/core"
import type { RemKey } from "#src/type/rem"
import type * as capi from "@ta/capi"
import * as std from "@ta/std"
import * as r from "react"

export const usePagNode = function <Key extends RemKey>(key: Key, pick: capi.SendMGet_Query<Key>["pick"]) {
    const hash = r.useMemo(() => std.object_hash_stable(pick ?? {}), [pick])

    return useSelect(state => state[key as "product"].rempag[hash] ?? null)
}
