import { res_event } from "#src/res/event"
import { res_new_json } from "#src/res/new/json"
import type { ApiResponse } from "#src/res/type/ApiResponse"
import type { SendConfig } from "#src/type/config"
import * as cst from "@ta/cst"
import type * as rest from "@ta/rest"
import type { rapi } from "@ta/rest"

export type SendPOrderMGet_Query = (
    rest.Cluster_Schema<typeof rapi.porder, "mget", "query">
)

export type SendPOrderMGet_Result = (
    rest.Cluster_Result<typeof rapi.porder, "mget">
)

export type SendPOrderMGet_Params = {
    readonly query: SendPOrderMGet_Query
    readonly config?: SendConfig<SendPOrderMGet_Result>
}

export const send_porder_mget = function(
    params: SendPOrderMGet_Params
): Promise<ApiResponse<SendPOrderMGet_Result>> {
    const url = new URL(`${cst.urlbase_api}/rest/porder`)

    for (const [q_k, q_v] of Object.entries(params.query)) {
        if (q_v !== undefined) {
            url.searchParams.append(q_k, JSON.stringify(q_v))
        }
    }

    const request = res_new_json<SendPOrderMGet_Result>({
        source: fetch(url, {
            method: "GET",
            credentials: "include",
            signal: params.config?.abort_signal,
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
