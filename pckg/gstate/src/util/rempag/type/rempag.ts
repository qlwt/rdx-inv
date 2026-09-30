import * as std from "@ta/std"

export type RemPagNode = {
    readonly status_pending: boolean
    readonly cursor: std.Maybe<string | null>
}

export type RemPag = {
    readonly [K in string]: RemPagNode
}
