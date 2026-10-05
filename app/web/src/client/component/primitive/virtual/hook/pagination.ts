import * as r from "react"

export const useEPVirtualPagination = function (pagination: EPVirtual) {
    r.useEffect(() => {
        const pag = props.pagination

        if (pag) {
            console.log(pag.status, grid_length, render_end, pag.threashhold)

            if (pag.status === "idle" && grid_length - render_end <= pag.threashhold) {
                pag.load()
            }
        }
    }, [grid_length, render_end, props.pagination?.threashhold, props.pagination?.load, props.pagination?.status])
}
