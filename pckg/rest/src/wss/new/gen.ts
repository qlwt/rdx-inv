import * as sc from "@qyu/signal-core"
import * as cst from "@ta/cst"
import * as http from "http"
import * as ws from "ws"
import * as std from "@ta/std"
import * as z from "zod"

const schema = std.zod_json().pipe(z.union([
    z.strictObject({
        kind: z.literal(cst.WSIEvent_Kind.CounterCheck),
    }),
]))

export const wss_new_gen = function(server: http.Server) {
    let counter_s = sc.signal_new_value(0)

    const wss = new ws.WebSocketServer({
        server,
        path: "/ws/gen",
    })

    wss.on("connection", wsi => {
        counter_s.input(counter_s.output() + 1)

        const counter_sub = () => {
            wsi.send(JSON.stringify({
                kind: cst.WSOEvent_Kind.CounterSet,
                value: counter_s.output(),
            } satisfies cst.WSOEvent))
        }

        counter_s.addsub(counter_sub)

        wsi.on("close", () => {
            counter_s.rmsub(counter_sub)

            counter_s.input(counter_s.output() - 1)
        })

        wsi.on("message", msg => {
            const event_p = schema.safeParse(msg.toString("utf8"))

            if (event_p.success) {
                const event = event_p.data

                switch (event.kind) {
                    case cst.WSIEvent_Kind.CounterCheck: {
                        counter_sub()

                        break
                    }
                }
            }
        })
    })
}
