import * as std from "@ta/std"

export type EPVirtual_Dim = {
    readonly row_gap: number
    readonly padding: number
    readonly row_height: number
    readonly row_length: number
}

export type EPVirtual_Dim_Reeval_Params = {
    readonly dim_set: std.FnSetterStateful<EPVirtual_Dim>
    readonly grid: HTMLElement | null
    readonly row: HTMLElement | null
}

export const epvirtual__dim_reeval = function(params: EPVirtual_Dim_Reeval_Params) {
    if (params.row && params.grid) {
        const computed_grid = window.getComputedStyle(params.grid)
        const computed_row = window.getComputedStyle(params.row)

        const grid_gap = Number.parseInt(computed_grid.columnGap)
        const row_height = Number.parseInt(computed_row.height)
        const grid_padding = Number.parseInt(computed_grid.paddingTop)
        const row_length = computed_grid.display !== "grid" ? 1 : computed_grid.gridTemplateColumns.trim().split(" ").length

        if (Number.isFinite(grid_gap + row_height + grid_padding)) {
            params.dim_set(measurements_old => {
                if (
                    measurements_old.row_gap !== grid_gap
                    || measurements_old.row_length !== row_length
                    || measurements_old.row_height !== row_height
                    || measurements_old.padding !== grid_padding
                ) {
                    return {
                        row_gap: grid_gap,
                        padding: grid_padding,
                        row_length: row_length,
                        row_height: row_height,
                    }
                }

                return measurements_old
            })
        }
    }
}
