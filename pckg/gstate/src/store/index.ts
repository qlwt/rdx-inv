import { gl_report, } from "#src/gl/report"
import type { GLReport_State } from "#src/gl/report/type/state"
import { gl_session } from "#src/gl/session"
import type { GLSession_State } from "#src/gl/session/type/state"
import { rem_porder } from "#src/rem/porder"
import { rem_product } from "#src/rem/product"
import { store_connect_ws_gen } from "#src/store/connect/ws_gen"
import type { RemKey } from "#src/type/rem"
import type { RemFam } from "#src/util/remfam/type/fam"
import * as rtk from "@reduxjs/toolkit"

export const store = rtk.configureStore({
    middleware: middleware_new_default => {
        return middleware_new_default().prepend(rem_porder.middle.derived_product.middleware)
    },

    reducer: {
        report: gl_report.reducer,
        session: gl_session.reducer,

        product: rem_product.reducer,
        porder: rem_porder.reducer,
    },
})

export type Store = typeof store
export type Dispatch = typeof store.dispatch

export type State = (
    & {
        report: GLReport_State
        session: GLSession_State
    }
    & {
        [K in RemKey]: RemFam<K>
    }
)

store_connect_ws_gen(store.dispatch.bind(store))
