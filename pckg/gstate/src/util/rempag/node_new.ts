import type { RemPagNode } from "#src/util/rempag/type/rempag";
import * as std from "@ta/std";

export const rempag_node_new = function(): RemPagNode {
    return {
        cursor: std.MNONE,
        status_pending: false,
    }
}
