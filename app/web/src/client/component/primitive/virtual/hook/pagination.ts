import type { EPVirtual_Pagination } from "#/src/client/component/primitive/virtual/type/pagination"
import * as r from "react"

export type UseEPVirtualPagination_Params = {
    readonly pagination?: EPVirtual_Pagination
    readonly grid_length: number
    readonly render_end: number
}

export const useEPVirtualPagination = function(params: UseEPVirtualPagination_Params) {
    const cleanup = r.useRef<VoidFunction | null>(null)
    const deps = params.pagination?.deps ?? []

    r.useEffect((): VoidFunction => {
        return () => {
            if (cleanup.current) {
                cleanup.current()

                cleanup.current = null
            }
        }
    }, deps)

    r.useEffect((): VoidFunction | void => {
        const pag = params.pagination

        if (pag && pag.status === "idle" && params.grid_length - params.render_end <= pag.threashhold) {
            cleanup.current?.()

            cleanup.current = pag.load() ?? null
        }
    }, [
        ...deps,
        params.grid_length,
        params.render_end,
        params.pagination?.status,
        params.pagination?.threashhold,
    ])
}
