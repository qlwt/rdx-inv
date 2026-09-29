import { res_event } from "#src/res/event"
import { res_new_json } from "#src/res/new/json"
import type { ApiResponse } from "#src/res/type/ApiResponse"
import type { SendConfig } from "#src/type/config"
import * as cst from "@ta/cst"
import type * as rest from "@ta/rest"
import type { rapi } from "@ta/rest"

export type SendPOrderPost_Body = (
    rest.Cluster_Schema<typeof rapi.porder, "post", "body">
)

export type SendPOrderPost_Result = (
    rest.Cluster_Result<typeof rapi.porder, "post">
)

export type SendPOrderPost_Params = {
    readonly body: SendPOrderPost_Body
    readonly config?: SendConfig<SendPOrderPost_Result>
}

export const send_porder_post = function(
    params: SendPOrderPost_Params
): Promise<ApiResponse<SendPOrderPost_Result>> {
    const url = new URL(`${cst.urlbase_api}/rest/porder`)

    const request = res_new_json<SendPOrderPost_Result>({
        source: fetch(url, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(params.body),
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
