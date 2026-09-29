import { res_event } from "#src/res/event"
import { res_new_json } from "#src/res/new/json"
import type { ApiResponse } from "#src/res/type/ApiResponse"
import type { SendConfig } from "#src/type/config"
import * as cst from "@inv/cst"
import type * as rest from "@inv/rest"
import type { rapi } from "@ta/rest"

export type SendProductDelete_URL = (
    rest.Cluster_Schema<typeof rapi.product, "delete", "url">
)

export type SendProductDelete_Result = (
    rest.Cluster_Result<typeof rapi.product, "delete">
)

export type SendProductDelete_Params = {
    readonly url: SendProductDelete_URL
    readonly config?: SendConfig<SendProductDelete_Result>
}

export const send_product_delete = function(
    params: SendProductDelete_Params
): Promise<ApiResponse<SendProductDelete_Result>> {
    const url = new URL(`${cst.urlbase_api}/rest/product/${params.url.id}`)

    const request = res_new_json<SendProductDelete_Result>({
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
