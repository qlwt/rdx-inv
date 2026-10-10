import type { EPVirtual_Dim } from "#/src/client/component/primitive/virtual/util/dim"

export type UseEPVirtualPadding_Params = {
    readonly grid_length: number
    readonly render_start: number
    readonly render_end: number

    readonly dim: EPVirtual_Dim
    readonly window_buffer: number
}

export const useEPVirtualPadding = function(params: UseEPVirtualPadding_Params) {
    const dim = params.dim

    const rwindow_first = Math.max(0, params.render_start - params.window_buffer)
    const rwindow_end = Math.min(params.grid_length, params.render_end + params.window_buffer)
    const bottom_length = params.grid_length - rwindow_end

    return {
        top: (
            + rwindow_first * dim.row_gap
            + rwindow_first * dim.row_height
        ),

        bottom: (
            + bottom_length * dim.row_height
            + bottom_length * dim.row_gap
        ),
    } as const
}
