import { useStore } from "#src/hook/core";
import * as rem from "#src/rem";
import type { RemKey } from "#src/type/rem";
import * as capi from "@ta/capi";
import * as std from "@ta/std";
import * as r from "react";

export type UsePagLoad_Params<Key extends RemKey> = {
    readonly status_active: boolean

    readonly limit: number | null
    readonly pick: NonNullable<capi.SendMGet_Query<Key>["pick"]>
}

export const usePagLoad = function <Key extends RemKey>(key: Key, params: UsePagLoad_Params<Key>) {
    const store = useStore()
    const hash = r.useMemo(() => std.object_hash_stable(params.pick), [params.pick])

    r.useEffect(() => {
        if (!params.status_active) { return }

        const pagnode = store.getState()[key].rempag[hash]

        if (pagnode && (pagnode.status_pending || std.maybe_is(pagnode.cursor, null))) {
            return
        }

        const abort_controller = new AbortController()

        store.dispatch(rem[key as "product"].act.pagload({
            query: {
                limit: params.limit,
                pick: params.pick as any,
                cursor: pagnode ? std.maybe_unpack(pagnode.cursor, null) : null,
            },

            config: {
                abort_signal: abort_controller.signal,
            },
        }, { signal: abort_controller.signal, }))

        return () => {
            abort_controller.abort("aborted")
        }
    }, [key, store, hash, params.limit, params.status_active])
}

export const usePagLoader = function <Key extends RemKey>(key: Key, params: UsePagLoad_Params<Key>): std.FnGetter<VoidFunction | void> {
    const store = useStore()
    const hash = r.useMemo(() => std.object_hash_stable(params.pick), [params.pick])

    return r.useCallback(() => {
        if (!params.status_active) { return }

        const pagnode = store.getState()[key].rempag[hash]

        const abort_controller = new AbortController()

        store.dispatch(rem[key as "product"].act.pagload({
            query: {
                limit: params.limit,
                pick: params.pick as any,
                cursor: pagnode ? std.maybe_unpack(pagnode.cursor, null) : null,
            },

            config: {
                abort_signal: abort_controller.signal,
            },
        }, { signal: abort_controller.signal, }))

        return () => {
            abort_controller.abort("aborted")
        }
    }, [key, store, hash, params.limit, params.status_active])
}
