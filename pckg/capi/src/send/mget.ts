import { res_event } from "#src/res/event"
import { res_new_json } from "#src/res/new/json"
import type { ApiResponse } from "#src/res/type/ApiResponse"
import type { SendKey } from "#src/send/type/rest"
import type { SendConfig } from "#src/type/config"
import * as cst from "@ta/cst"
import type * as rest from "@ta/rest"
import type { rapi } from "@ta/rest"

export type SendMGet_Query<Key extends SendKey> = (
    rest.Cluster_Schema<typeof rapi[Key], "mget", "query">
)

export type SendMGet_Result<Key extends SendKey> = (
    rest.Cluster_Result<typeof rapi[Key], "mget">
)

export type SendMGet_Params<Key extends SendKey> = {
    readonly query: SendMGet_Query<Key>
    readonly config?: SendConfig<SendMGet_Result<Key>>
}

export const send_mget = function <Key extends SendKey>(
    key: Key, params: SendMGet_Params<Key>
): Promise<ApiResponse<SendMGet_Result<Key>>> {
    const url = new URL(`${cst.urlbase_api}/rest/${key}`)

    for (const [q_k, q_v] of Object.entries(params.query)) {
        if (q_v !== undefined) {
            url.searchParams.append(q_k, JSON.stringify(q_v))
        }
    }

    const request = res_new_json<SendMGet_Result<Key>>({
        source: fetch(url, {
            method: "GET",
            credentials: "include",
            signal: params.config?.abort_signal,
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
