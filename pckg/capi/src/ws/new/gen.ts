import * as cst from "@ta/cst"

export const ws_new_gen = function () {
    return new WebSocket(`${cst.urlbase_api}/ws/gen`)
}
