import { gl_report, } from "#src/gl/report"
import { gl_session } from "#src/gl/session"
import { rem_porder } from "#src/rem/porder"
import { rem_product } from "#src/rem/product"
import { store_connect_ws_gen } from "#src/store/connect/ws_gen"
import * as rtk from "@reduxjs/toolkit"

export const store = rtk.configureStore({
    reducer: {
        report: gl_report.reducer,
        session: gl_session.reducer,

        product: rem_product.reducer,
        porder: rem_porder.reducer,
    },
})

export type Store = typeof store
export type Dispatch = typeof store.dispatch
export type State = ReturnType<typeof store.getState>

store_connect_ws_gen(store.dispatch.bind(store))
