import { useSelect } from "#src/hook/core"
import type { RemKey, RemNode } from "#src/type/rem"
import * as r from "react"

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

        if (remlog.patch) {
            return {
                data: {
                    ...entry,
                    ...remlog.patch.data,
                },

                pending: {
                    del: remlog.del.length >= 1,
                    post: Boolean(remlog.post),
                },
            }
        }

        return {
            data: entry,

            pending: {
                del: remlog.del.length >= 1,
                post: Boolean(remlog.post),
            },
        }
    }, [remlog, entry])
}
