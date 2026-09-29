import { res_event } from "#src/res/event"
import { res_new_json } from "#src/res/new/json"
import type { ApiResponse } from "#src/res/type/ApiResponse"
import type { SendConfig } from "#src/type/config"
import * as cst from "@ta/cst"
import type * as rest from "@ta/rest"
import type { rapi } from "@ta/rest"

export type SendPOrderPatch_URL = (
    rest.Cluster_Schema<typeof rapi.porder, "patch", "url">
)

export type SendPOrderPatch_Body = (
    rest.Cluster_Schema<typeof rapi.porder, "patch", "body">
)

export type SendPOrderPatch_Result = (
    rest.Cluster_Result<typeof rapi.porder, "patch">
)

export type SendPOrderPatch_Params = {
    readonly url: SendPOrderPatch_URL
    readonly body: SendPOrderPatch_Body
    readonly config?: SendConfig<SendPOrderPatch_Result>
}

export const send_porder_patch = function(
    params: SendPOrderPatch_Params
): Promise<ApiResponse<SendPOrderPatch_Result>> {
    const url = new URL(`${cst.urlbase_api}/rest/porder/${params.url.id}`)

    const request = res_new_json<SendPOrderPatch_Result>({
        source: fetch(url, {
            method: "PATCH",
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
