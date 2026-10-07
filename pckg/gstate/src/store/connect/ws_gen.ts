import { gl_session } from "#src/gl/session"
import * as rtk from "@reduxjs/toolkit"
import * as capi from "@ta/capi"
import * as cst from "@ta/cst"
import * as std from "@ta/std"

export const store_connect_ws_gen = function(dispatch: rtk.Dispatch) {
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
        const ev_m = std.json_parse_safe(msg.data)

        if (!(ev_m.kind && ev_m.value && typeof ev_m.value === "object" && !Array.isArray(ev_m))) {
            console.error("Unknown Event Recieved from WebSocket", msg.data)

            return
        }

        const ev = ev_m.value

        switch (ev.kind) {
            case cst.WSOEvent_Kind.CounterSet: {
                dispatch(gl_session.act.counter_set({ counter: ev.value, }))

                break
            }
            default: {
                console.error("Unknown Event Recieved from WebSocket", msg.data)

                break
            }
        }
    })
}
