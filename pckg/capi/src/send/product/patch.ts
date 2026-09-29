import { res_event } from "#src/res/event"
import { res_new_json } from "#src/res/new/json"
import type { ApiResponse } from "#src/res/type/ApiResponse"
import type { SendConfig } from "#src/type/config"
import * as cst from "@ta/cst"
import type * as rest from "@ta/rest"
import type { rapi } from "@ta/rest"

export type SendProductPatch_URL = (
    rest.Cluster_Schema<typeof rapi.product, "patch", "url">
)

export type SendProductPatch_Body = (
    rest.Cluster_Schema<typeof rapi.product, "patch", "body">
)

export type SendProductPatch_Result = (
    rest.Cluster_Result<typeof rapi.product, "patch">
)

export type SendProductPatch_Params = {
    readonly url: SendProductPatch_URL
    readonly body: SendProductPatch_Body
    readonly config?: SendConfig<SendProductPatch_Result>
}

export const send_product_patch = function(
    params: SendProductPatch_Params
): Promise<ApiResponse<SendProductPatch_Result>> {
    const url = new URL(`${cst.urlbase_api}/rest/product/${params.url.id}`)

    const request = res_new_json<SendProductPatch_Result>({
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
