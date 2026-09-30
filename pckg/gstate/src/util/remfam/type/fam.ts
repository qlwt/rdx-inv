import type { RemKey, RemNode } from "#src/type/rem"
import type { RemLog } from "#src/util/remlog/type/remlog"
import type { RemPag } from "#src/util/rempag/type/rempag"
import type * as rtk from "@reduxjs/toolkit"

export type RemFam<Key extends RemKey> = {
    rempag: RemPag
    remlog: RemLog<RemNode<Key>>
    ent: rtk.EntityState<RemNode<Key>, string>
}
