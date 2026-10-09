import { filedef_push_formdata } from "#src/file/def/push/formdata"
import type { FileDataDef } from "#src/file/type/def"
import { res_event } from "#src/res/event"
import { res_new_json } from "#src/res/new/json"
import type { ApiResponse } from "#src/res/type/ApiResponse"
import type { SendConfig } from "#src/type/config"
import * as cst from "@ta/cst"
import type * as rest from "@ta/rest"
import type { rxapi } from "@ta/rest"

type FilesRaw = rest.Cluster_Schema<typeof rxapi.pgroup, "post_img", "files">

type TransformTuple<Tuple extends readonly any[], T> = {
    [K in keyof Tuple]: T
}

export type SendXPGroupPostImg_URL = (
    rest.Cluster_Schema<typeof rxapi.pgroup, "post_img", "url">
)

export type SendXPGroupPostImg_Body = (
    rest.Cluster_Schema<typeof rxapi.pgroup, "post_img", "body">["payload"]
)

export type SendXPGroupPostImg_FilesHMap = {
    [Field in keyof FilesRaw]: FilesRaw[Field] extends readonly any[] ? (
        TransformTuple<FilesRaw[Field], FileDataDef>
    ) : never
}

export type SendXPGroupPostImg_Files = {
    (): Promise<SendXPGroupPostImg_FilesHMap>
}

export type SendXPGroupPostImg_Result = (
    rest.Cluster_Result<typeof rxapi.pgroup, "post_img">
)

export type SendXPGroupPostImg_Params = {
    readonly url: SendXPGroupPostImg_URL
    readonly body: SendXPGroupPostImg_Body
    readonly files: SendXPGroupPostImg_Files
    readonly config?: SendConfig<SendXPGroupPostImg_Result>
}

export const sendx_pgroup_post_img = async function(
    params: SendXPGroupPostImg_Params
): Promise<ApiResponse<SendXPGroupPostImg_Result>> {
    const url = new URL(`${cst.urlbase_api}/restx/pgroup/${params.url.id}/img`)
    const formdata = new FormData()
    const files = await params.files()

    for (const formdata_key of Object.keys(files)) {
        for (const filedef of files[formdata_key as keyof typeof files]) {
            filedef_push_formdata(formdata, formdata_key, filedef)
        }
    }

    const clone: Partial<typeof params.body> = {}

    for (const formdata_key of Object.keys(params.body) as (keyof typeof params.body)[]) {
        const data = params.body[formdata_key]

        if (data !== undefined) {
            clone[formdata_key] = data
        }
    }

    formdata.append("payload", JSON.stringify(clone))

    const request = res_new_json<SendXPGroupPostImg_Result>({
        source: fetch(url, {
            signal: params.config?.abort_signal,
            method: "POST",
            body: formdata,
            credentials: "include",
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
