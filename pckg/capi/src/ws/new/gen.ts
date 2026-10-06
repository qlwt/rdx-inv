import * as cst from "@ta/cst"

export const ws_new_gen = function () {
    const ws = new WebSocket(`${cst.urlbase_api}/ws/gen`)

    window.addEventListener("pagehide", () => {
        if (ws.readyState === ws.OPEN) {
            ws.close()
        }
    })

    return ws
}
