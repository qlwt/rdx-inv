import { useEPVirtualPadding } from "#/src/client/component/primitive/virtual/hook/padding"
import { useEPVirtualPagination } from "#/src/client/component/primitive/virtual/hook/pagination"
import type { EPVirtual_Pagination } from "#/src/client/component/primitive/virtual/type/pagination"
import { epvirtual__dim_reeval, type EPVirtual_Dim } from "#/src/client/component/primitive/virtual/util/dim"
import st from "#client/component/primitive/virtual/style/view.module.scss"
import * as rfc from "@qyu/reactcmp-flow-control"
import * as stdr from "@ta/std-react"
import cl from "classnames"
import * as r from "react"
import * as rbs from "react-bootstrap"

export type EPVirtual__LMonDyn_Props = {
    readonly window_buffer: number

    readonly src_length: number
    readonly src_render: (index: number, refi: stdr.RefI<HTMLElement | null> | null) => r.ReactNode

    readonly grid_render: (props: r.JSX.IntrinsicElements["div"]) => r.ReactNode

    readonly container_render?: (props: r.JSX.IntrinsicElements["div"]) => r.ReactNode

    readonly pagination?: EPVirtual_Pagination
}

const dprop_container_render: NonNullable<EPVirtual__LMonDyn_Props["container_render"]> = props => {
    return <div {...props} />
}

export const EPVirtual_LMonDyn: r.FC<EPVirtual__LMonDyn_Props> = props => {
    const nprop_container_render = props.container_render ?? dprop_container_render

    const ref_container = r.useRef<HTMLDivElement | null>(null)
    const refo_container = stdr.useRefO(ref_container)
    const ref_grid = r.useRef<HTMLDivElement | null>(null)
    const ref_first = r.useRef<HTMLElement | null>(null)
    const refi_first = stdr.useRefI(ref_first)

    const container_size = stdr.useSizeObserver({
        refo_target: refo_container,

        ignore: {
            width: true,
        },
    })

    const [render_start, render_start_set] = r.useState(0)
    const [render_end, render_end_set] = r.useState(Math.min(1, props.src_length))

    const [dim, dim_set] = r.useState<EPVirtual_Dim>(() => ({
        row_gap: 0,
        padding: 0,
        row_length: 1,
        row_height: 300,
    }))

    const grid_length = Math.ceil(props.src_length / dim.row_length)

    useEPVirtualPagination({
        render_end,
        grid_length,
        pagination: props.pagination,
    })

    const padding = useEPVirtualPadding({
        dim,
        render_end,
        render_start,
        grid_length: grid_length,
        window_buffer: props.window_buffer,
    })

    const element_items = r.useMemo(() => {
        const result: r.ReactNode[] = []
        const rwindow_first = Math.max(0, render_start - props.window_buffer)
        const rwindow_end = Math.min(grid_length, render_end + props.window_buffer)

        {
            let i = rwindow_first * dim.row_length

            if (i < Math.min(props.src_length, rwindow_end * dim.row_length)) {
                result.push(props.src_render(i, refi_first))

                for (++i; i < Math.min(props.src_length, rwindow_end * dim.row_length); ++i) {
                    result.push(props.src_render(i, null))
                }
            }

        }

        return result
    }, [render_start, render_end, props.window_buffer, props.src_length, dim.row_length, grid_length, props.src_render, refi_first])

    const element_grid = r.useMemo(() => {
        return props.grid_render({
            ref: ref_grid,
            children: element_items,
        })
    }, [element_items, props.grid_render])

    r.useLayoutEffect(() => {
        const container = ref_container.current

        if (!container) {
            return
        }

        const content_scroll = Math.max(
            0,
            container.scrollTop - dim.padding
        )

        const now_render_start = Math.max(
            0,
            Math.floor(
                (content_scroll + dim.row_gap)
                / (dim.row_height + dim.row_gap)
            )
        )

        if (container_size?.height !== undefined) {
            const now_padding_top = (
                + now_render_start * dim.row_gap
                + now_render_start * dim.row_height
            )

            const content_height = Math.max(
                0,
                container_size.height + content_scroll - now_padding_top
            )

            const now_render_end = Math.min(
                grid_length,
                now_render_start + Math.ceil(
                    (content_height + dim.row_gap)
                    / (dim.row_height + dim.row_gap)
                )
            )

            render_start_set(now_render_start)
            render_end_set(now_render_end)
        } else {
            render_start_set(now_render_start)
            render_end_set(now_render_start)
        }
    }, [container_size, dim.padding, dim.row_gap, dim.row_height, grid_length])

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

    return nprop_container_render({
        ref: ref_container,
        className: cl(st.root, st._l),

        onScroll: event => {
            const scroll_y = Math.max(0, Math.min(event.currentTarget.scrollTop) - dim.padding)
            const now_render_start = Math.floor((scroll_y + dim.row_gap) / (dim.row_height + dim.row_gap))

            if (container_size?.height !== undefined) {
                const now_padding_top = (
                    + now_render_start * dim.row_gap
                    + now_render_start * dim.row_height
                )

                const content_height = Math.max(0, container_size.height + scroll_y - now_padding_top)
                const now_render_end = now_render_start + Math.ceil((content_height + dim.row_gap) / (dim.row_height + dim.row_gap))

                render_start_set(now_render_start)
                render_end_set(now_render_end)
            } else {
                render_start_set(now_render_start)
                render_end_set(now_render_start)
            }
        },

        children: <>
            <div className={st.plate_placeholder} style={{ height: `${padding.top}px` }} />

            {element_grid}

            <div className={st.plate_placeholder} style={{ height: `${padding.bottom}px` }} />

            <rfc.CmpIf value={props.pagination && props.pagination.status !== "fulfilled"}>
                <div className={st.plate_pending} style={{ height: `${dim.row_height}px` }}>
                    <rbs.Spinner />
                </div>
            </rfc.CmpIf>
        </>
    })
}

export default EPVirtual_LMonDyn
