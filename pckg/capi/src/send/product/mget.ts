import { res_event } from "#src/res/event"
import { res_new_json } from "#src/res/new/json"
import type { ApiResponse } from "#src/res/type/ApiResponse"
import type { SendConfig } from "#src/type/config"
import * as cst from "@ta/cst"
import type * as rest from "@ta/rest"
import type { rapi } from "@ta/rest"

export type SendProductMGet_Query = (
    rest.Cluster_Schema<typeof rapi.product, "mget", "query">
)

export type SendProductMGet_Result = (
    rest.Cluster_Result<typeof rapi.product, "mget">
)

export type SendProductMGet_Params = {
    readonly query: SendProductMGet_Query
    readonly config?: SendConfig<SendProductMGet_Result>
}

export const send_product_mget = function(
    params: SendProductMGet_Params
): Promise<ApiResponse<SendProductMGet_Result>> {
    const url = new URL(`${cst.urlbase_api}/rest/product`)

    for (const [q_k, q_v] of Object.entries(params.query)) {
        if (q_v !== undefined) {
            url.searchParams.append(q_k, JSON.stringify(q_v))
        }
    }

    const request = res_new_json<SendProductMGet_Result>({
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
