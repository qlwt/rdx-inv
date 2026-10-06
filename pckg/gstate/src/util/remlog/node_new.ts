import type { RemLogNode } from "#src/util/remlog/type/remlog";
import type * as rtk from "@reduxjs/toolkit"

export const remlog_node_new = function <Node extends object>(): RemLogNode<Node> {
    return {
        del: [],
        post: null,
        patch: null,
    }
}

export const remlog_node_new_wr = function <Node extends object>() {
    return remlog_node_new() as rtk.WritableDraft<RemLogNode<Node>>
}
