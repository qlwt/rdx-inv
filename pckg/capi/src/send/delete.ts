import { res_event } from "#src/res/event"
import { res_new_json } from "#src/res/new/json"
import type { ApiResponse } from "#src/res/type/ApiResponse"
import type { SendKey } from "#src/send/type/rest"
import type { SendConfig } from "#src/type/config"
import * as cst from "@ta/cst"
import type * as rest from "@ta/rest"
import type { rapi } from "@ta/rest"

export type SendDelete_URL<K extends SendKey> = (
    rest.Cluster_Schema<typeof rapi[K], "delete", "url">
)

export type SendDelete_Result<K extends SendKey> = (
    rest.Cluster_Result<typeof rapi[K], "delete">
)

export type SendDelete_Params<K extends SendKey> = {
    readonly url: SendDelete_URL<K>
    readonly config?: SendConfig<SendDelete_Result<K>>
}

export const send_delete = function <K extends SendKey>(
    key: K, params: SendDelete_Params<K>
): Promise<ApiResponse<SendDelete_Result<K>>> {
    const url = new URL(`${cst.urlbase_api}/rest/${key}/${params.url.id}`)

    const request = res_new_json<SendDelete_Result<K>>({
        source: new Promise(res => {
            setTimeout(() => {
                res(fetch(url, {
                    method: "DELETE",
                    credentials: "include",
                    signal: params.config?.abort_signal,

                    headers: {
                        "Content-Type": "application/json"
                    },
                }))
            }, 1000)
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
