import { res_event } from "#src/res/event"
import { res_new_json } from "#src/res/new/json"
import type { ApiResponse } from "#src/res/type/ApiResponse"
import type { SendConfig } from "#src/type/config"
import * as cst from "@ta/cst"
import type * as rest from "@ta/rest"
import type { rapi } from "@ta/rest"

export type SendProductPost_Body = (
    rest.Cluster_Schema<typeof rapi.product, "post", "body">
)

export type SendProductPost_Result = (
    rest.Cluster_Result<typeof rapi.product, "post">
)

export type SendProductPost_Params = {
    readonly body: SendProductPost_Body
    readonly config?: SendConfig<SendProductPost_Result>
}

export const send_product_post = function(
    params: SendProductPost_Params
): Promise<ApiResponse<SendProductPost_Result>> {
    const url = new URL(`${cst.urlbase_api}/rest/product`)

    const request = res_new_json<SendProductPost_Result>({
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
