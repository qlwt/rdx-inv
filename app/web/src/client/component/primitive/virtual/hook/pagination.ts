import type { EPVirtual_Pagination } from "#/src/client/component/primitive/virtual/type/pagination"
import * as r from "react"

export type UseEPVirtualPagination_Params = {
    readonly pagination?: EPVirtual_Pagination
    readonly grid_length: number
    readonly render_end: number
}

export const useEPVirtualPagination = function (params: UseEPVirtualPagination_Params) {
    r.useEffect(() => {
        const pag = params.pagination

        if (pag) {
            if (pag.status === "idle" && params.grid_length - params.render_end <= pag.threashhold) {
                pag.load()
            }
        }
    }, [
        params.grid_length,
        params.render_end,
        params.pagination?.threashhold,
        params.pagination?.load,
        params.pagination?.status
    ])
}
