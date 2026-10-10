import { res_event } from "#src/res/event"
import { res_new_json } from "#src/res/new/json"
import type { ApiResponse } from "#src/res/type/ApiResponse"
import type { SendKey } from "#src/send/type/rest"
import type { SendConfig } from "#src/type/config"
import * as cst from "@ta/cst"
import type * as rest from "@ta/rest"
import type { rapi } from "@ta/rest"

export type SendPatch_URL<Key extends SendKey> = (
    rest.Cluster_Schema<typeof rapi[Key], "patch", "url">
)

export type SendPatch_Body<Key extends SendKey> = (
    rest.Cluster_Schema<typeof rapi[Key], "patch", "body">
)

export type SendPatch_Result<Key extends SendKey> = (
    rest.Cluster_Result<typeof rapi[Key], "patch">
)

export type SendPatch_Params<Key extends SendKey> = {
    readonly url: SendPatch_URL<Key>
    readonly body: SendPatch_Body<Key>
    readonly config?: SendConfig<SendPatch_Result<Key>>
}

export const send_patch = function <Key extends SendKey>(
    key: Key, params: SendPatch_Params<Key>
): Promise<ApiResponse<SendPatch_Result<Key>>> {
    const url = new URL(`${cst.urlbase_api}/rest/${key}/${params.url.id}`)

    const request = res_new_json<SendPatch_Result<Key>>({
        source: fetch(url, {
            method: "PATCH",
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
