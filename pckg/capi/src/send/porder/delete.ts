import { res_event } from "#src/res/event"
import { res_new_json } from "#src/res/new/json"
import type { ApiResponse } from "#src/res/type/ApiResponse"
import type { SendConfig } from "#src/type/config"
import * as cst from "@ta/cst"
import type * as rest from "@ta/rest"
import type { rapi } from "@ta/rest"

export type SendPOrderDelete_URL = (
    rest.Cluster_Schema<typeof rapi.porder, "delete", "url">
)

export type SendPOrderDelete_Result = (
    rest.Cluster_Result<typeof rapi.porder, "delete">
)

export type SendPOrderDelete_Params = {
    readonly url: SendPOrderDelete_URL
    readonly config?: SendConfig<SendPOrderDelete_Result>
}

export const send_porder_delete = function(
    params: SendPOrderDelete_Params
): Promise<ApiResponse<SendPOrderDelete_Result>> {
    const url = new URL(`${cst.urlbase_api}/rest/porder/${params.url.id}`)

    const request = res_new_json<SendPOrderDelete_Result>({
        source: fetch(url, {
            method: "DELETE",
            credentials: "include",
            signal: params.config?.abort_signal,

            headers: {
                "Content-Type": "application/json"
            },
        })
    })

    if (params.config?.events) {
        res_event({
            request,
            events: params.config.events,
        })
    }

    return request
}
