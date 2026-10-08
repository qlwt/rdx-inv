import { useSelect } from "#src/hook/core"
import type { RemKey, RemNode } from "#src/type/rem"
import type { RemLogNode } from "#src/util/remlog/type/remlog"
import * as r from "react"

export const rview_data_new = function <Node extends object>(rnode: Node, rlog: RemLogNode<Node>): Node {
    if (rlog.patch.length === 0) {
        return rnode
    }

    if (rlog.patch.length === 1) {
        return {
            ...rnode,
            ...rlog.patch[0]!.data,
        }
    }

    return Object.assign({
        ...rnode,
    }, ...rlog.patch.map(p => p.data))
}

export type RemView<Key extends RemKey> = {
    readonly data: RemNode<Key>

    readonly pending: {
        readonly del: boolean
        readonly post: boolean
    }
}

export const useRemView = function <Key extends RemKey>(key: Key, entry: RemNode<Key>): RemView<Key> {
    const remlog = useSelect(state => state[key].remlog[entry.id]) as RemLogNode<RemNode<Key>> | undefined

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

export const useRemViewFallback = function <Key extends RemKey, F>(fallback: F, key: Key, entry: RemNode<Key> | null): RemView<Key> | F {
    const remlog = useSelect(state => entry ? state[key].remlog[entry.id] : null) as RemLogNode<RemNode<Key>> | null | undefined

    return r.useMemo(() => {
        if (!entry) {
            return fallback
        }

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
    }, [remlog, entry, fallback])
}
