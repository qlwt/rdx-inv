import { useSelect } from "#src/hook/core"
import type { RemKey, RemNode } from "#src/type/rem"
import type { RemLogNode } from "#src/util/remlog/type/remlog"
import * as r from "react"

export const rview_data_new = function <Node extends object>(rnode: Node, rlog: RemLogNode<Node>): Node {
    if (rlog.patch) {
        return {
            ...rnode,
            ...rlog.patch.data,
        }
    }

    return rnode
}

export type RemView<Key extends RemKey> = {
    readonly data: RemNode<Key>

    readonly pending: {
        readonly del: boolean
        readonly post: boolean
    }
}

export const useRemView = function <Key extends RemKey>(key: Key, entry: RemNode<Key>): RemView<Key> {
    const remlog = useSelect(state => state[key as "product"].remlog[entry.id])

    return r.useMemo(() => {
        if (!remlog) {
            return {
                data: entry,

                pending: {
                    del: false,
                    post: false,
                }
            }
        }

        return {
            data: rview_data_new(entry, remlog),

            pending: {
                del: remlog.del.length >= 1,
                post: Boolean(remlog.post),
            },
        }
    }, [remlog, entry])
}
