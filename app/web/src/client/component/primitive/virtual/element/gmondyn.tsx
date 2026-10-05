import type { EPVirtual_Pagination, EPVirtual_PaginationStatus } from "#/src/client/component/primitive/virtual/type/pagination"
import { epvirtual__dim_reeval, type EPVirtual_Dim } from "#/src/client/component/primitive/virtual/util/dim"
import st from "#client/component/primitive/virtual/style/view.module.scss"
import * as rfc from "@qyu/reactcmp-flow-control"
import * as std from "@ta/std"
import * as stdr from "@ta/std-react"
import cl from "classnames"
import * as r from "react"
import * as rbs from "react-bootstrap"

type Render_Reeval_Params = {
    readonly src_length: number
    readonly dim: EPVirtual_Dim
    readonly container: HTMLElement | null

    readonly render_start_set: std.FnSetterStateles<number>
    readonly render_end_set: std.FnSetterStateles<number>
}

const render_reeval = function(params: Render_Reeval_Params) {
    if (!params.container) { return }

    const container_rect = params.container.getBoundingClientRect()

    const view_start = window.screenY - container_rect.y
    const view_end = (window.screenY + window.innerHeight) - container_rect.y

    if (container_rect.y > (window.screenY + container_rect.height) || view_end < 0) {
        return
    }

    params.render_start_set(Math.min(
        params.src_length,
        Math.floor(
            (Math.max(0, view_start) + params.dim.row_gap)
            / (params.dim.row_height + params.dim.row_gap)
        )
    ))

    params.render_end_set(Math.min(params.src_length,
        Math.ceil(
            (view_end + params.dim.row_gap)
            / (params.dim.row_height + params.dim.row_gap)
        )
    ))

}


export type EPVirtualt__GMonDyn_Props = {
    readonly window_buffer: number

    readonly src_length: number
    readonly grid_render: (props: r.JSX.IntrinsicElements["div"]) => r.ReactNode
    readonly container_render?: (props: r.JSX.IntrinsicElements["div"]) => r.ReactNode
    readonly src_render: (index: number, refi: stdr.RefI<HTMLElement | null> | null) => r.ReactNode

    readonly pagination?: EPVirtual_Pagination
}

const dprop_container_render: NonNullable<EPVirtualt__GMonDyn_Props["container_render"]> = props => {
    return <div {...props} />
}

export const EPVirtual_GMonDyn: r.FC<EPVirtualt__GMonDyn_Props> = props => {
    const nprop_container_render = props.container_render ?? dprop_container_render

    const ref_container = r.useRef<HTMLDivElement | null>(null)
    const ref_grid = r.useRef<HTMLDivElement | null>(null)
    const ref_first = r.useRef<HTMLElement | null>(null)
    const refi_first = stdr.useRefI(ref_first)

    const [render_start, render_start_set] = r.useState(0)
    const [render_end, render_end_set] = r.useState(Math.min(1, props.src_length))

    const grid_length = props.src_length

    const [dim, dim_set] = r.useState<EPVirtual_Dim>(() => ({
        row_gap: 0,
        padding: 0,
        row_height: 300,
    }))

    const padding_top = r.useMemo(() => {
        const rwindow_first = Math.max(0, render_start - props.window_buffer)

        return (
            + rwindow_first * dim.row_gap
            + rwindow_first * dim.row_height
        )
    }, [render_start, dim, grid_length, props.window_buffer])

    const padding_bottom = r.useMemo(() => {
        const rwindow_end = Math.min(grid_length, render_end + props.window_buffer)

        const bottom_length = grid_length - rwindow_end

        return (
            + bottom_length * dim.row_height
            + bottom_length * dim.row_gap
        )
    }, [render_end, dim, dim.row_gap, grid_length])

    const element_items = r.useMemo(() => {
        const result: r.ReactNode[] = []
        const rwindow_first = Math.max(0, render_start - props.window_buffer)
        const rwindow_end = Math.min(grid_length, render_end + props.window_buffer)

        {
            let i = rwindow_first

            if (i < Math.min(props.src_length, rwindow_end)) {
                result.push(props.src_render(i, refi_first))
            } else {
                return result
            }

            for (++i; i < Math.min(props.src_length, rwindow_end); ++i) {
                result.push(props.src_render(i, null))
            }
        }

        return result
    }, [render_start, render_end, props.window_buffer, grid_length, props.src_length, props.src_render])

    const element_grid = r.useMemo(() => {
        return props.grid_render({
            ref: ref_grid,
            children: element_items,
        })
    }, [element_items, props.grid_render])

    r.useLayoutEffect(() => {
        const abort_controller = new AbortController()

        window.addEventListener("resize", () => {
            epvirtual__dim_reeval({
                dim_set: dim_set,

                row: ref_first.current,
                grid: ref_grid.current,
            })
        })

        epvirtual__dim_reeval({
            dim_set: dim_set,

            row: ref_first.current,
            grid: ref_grid.current,
        })

        return () => {
            abort_controller.abort()
        }
    }, [props.src_render, props.src_length, props.grid_render, nprop_container_render])

    r.useEffect(() => {
        const container = ref_container.current

        if (!container) {
            return
        }

        const abort_controller = new AbortController()

        {
            let target: HTMLElement | null = container

            do {
                target.addEventListener(
                    "scroll",
                    () => {
                        render_reeval({
                            container,
                            dim: dim,
                            src_length: props.src_length,

                            render_end_set,
                            render_start_set,
                        })
                    },
                    { signal: abort_controller.signal, }
                )

                target = target.parentElement
            } while (target !== null)
        }

        {
            window.addEventListener(
                "resize",
                () => {
                    render_reeval({
                        container,
                        dim: dim,
                        src_length: props.src_length,

                        render_end_set,
                        render_start_set,
                    })
                },
                {
                    signal: abort_controller.signal,
                }
            )
        }

        render_reeval({
            container,
            dim: dim,
            src_length: props.src_length,

            render_end_set,
            render_start_set,
        })

        return () => {
            abort_controller.abort()
        }
    }, [dim, props.src_length])

    return nprop_container_render({
        ref: ref_container,
        className: cl(st.root, st._g),

        children: <>
            <div className={st.plate_placeholder} style={{ height: `${padding_top}px` }} />

            {element_grid}

            <div className={st.plate_placeholder} style={{ height: `${padding_bottom}px` }} />

            <rfc.CmpIf value={props.pagination && props.pagination.status !== "fulfilled"}>
                <div className={st.plate_pending} style={{ height: `${dim.row_height}px` }}>
                    <rbs.Spinner />
                </div>
            </rfc.CmpIf>
        </>
    })
}

export default EPVirtual_GMonDyn
