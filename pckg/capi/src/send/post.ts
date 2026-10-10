import { res_event } from "#src/res/event"
import { res_new_json } from "#src/res/new/json"
import type { ApiResponse } from "#src/res/type/ApiResponse"
import type { SendKey } from "#src/send/type/rest"
import type { SendConfig } from "#src/type/config"
import * as cst from "@ta/cst"
import type * as rest from "@ta/rest"
import type { rapi } from "@ta/rest"

export type SendPost_Body<Key extends SendKey> = (
    rest.Cluster_Schema<typeof rapi[Key], "post", "body">
)

export type SendPost_Result<Key extends SendKey> = (
    rest.Cluster_Result<typeof rapi[Key], "post">
)

export type SendPost_Params<Key extends SendKey> = {
    readonly body: SendPost_Body<Key>
    readonly config?: SendConfig<SendPost_Result<Key>>
}

export const send_post = function <Key extends SendKey>(
    key: Key, params: SendPost_Params<Key>
): Promise<ApiResponse<SendPost_Result<Key>>> {
    const url = new URL(`${cst.urlbase_api}/rest/${key}`)

    const request = res_new_json<SendPost_Result<Key>>({
        source: fetch(url, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(params.body),
            signal: params.config?.abort_signal,

            headers: {
                "Content-Type": "application/json"
            },
        }),
    })

    if (params.config?.events) {
        res_event({
            request,
            events: params.config.events,
        })
    }

    return request
}
