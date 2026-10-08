import type { RemKey, RemNode } from "#src/type/rem"
import * as rtk from "@reduxjs/toolkit"

export const remfam_adapter_new = function<Key extends RemKey>() {
    return rtk.createEntityAdapter({
        selectId: (node: RemNode<Key>) => node.id,
        sortComparer: (a, b) => -a.id.localeCompare(b.id),
    })
}
