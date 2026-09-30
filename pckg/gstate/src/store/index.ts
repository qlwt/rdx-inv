import { gl_report, } from "#src/gl/report"
import { rem_product } from "#src/rem/product"
import * as rtk from "@reduxjs/toolkit"

export const store = rtk.configureStore({
    reducer: {
        report: gl_report.reducer,
        product: rem_product.reducer,
    },
})

export type Store = typeof store
export type Dispatch = typeof store.dispatch
export type State = ReturnType<typeof store.getState>
