import { gl_session } from "#src/gl/session"
import * as rtk from "@reduxjs/toolkit"
import * as capi from "@ta/capi"
import * as cst from "@ta/cst"
import * as std from "@ta/std"
import * as z from "zod"

export const store_connect_ws_gen = function(dispatch: rtk.Dispatch) {
    const schema = std.zod_json().pipe(z.union([
        z.strictObject({
            kind: z.literal(cst.WSOEvent_Kind.CounterSet),
            value: z.number(),
        }),
    ] as const))

    switch (capi.ws_con_gen.readyState) {
        case capi.ws_con_gen.CONNECTING: {
            capi.ws_con_gen.addEventListener("open", () => {
                capi.ws_con_gen.send(JSON.stringify({
                    kind: cst.WSIEvent_Kind.CounterCheck,
                } satisfies cst.WSIEvent))
            })

            break
        }
        case capi.ws_con_gen.OPEN: {
            capi.ws_con_gen.send(JSON.stringify({
                kind: cst.WSIEvent_Kind.CounterCheck,
            } satisfies cst.WSIEvent))

            break
        }
    }

    capi.ws_con_gen.addEventListener("message", msg => {
        const ev_p = schema.safeParse(msg.data)

        if (!ev_p.success) {
            console.error("Unknown Event Recieved", msg.data)

            return
        }

        const ev = ev_p.data

        switch (ev.kind) {
            case cst.WSOEvent_Kind.CounterSet: {
                dispatch(gl_session.act.counter_set({ counter: ev.value, }))

                break
            }
        }
    })
}
