import { filedef_push_formdata } from "#src/file/def/push/formdata"
import type { FileDataDef } from "#src/file/type/def"
import { res_event } from "#src/res/event"
import { res_new_json } from "#src/res/new/json"
import type { ApiResponse } from "#src/res/type/ApiResponse"
import type { SendConfig } from "#src/type/config"
import * as cst from "@ta/cst"
import type * as rest from "@ta/rest"
import type { rxapi } from "@ta/rest"

export type SendXImgPost_Body = (
    rest.Cluster_Schema<typeof rxapi.img, "post", "body">["payload"]
)

type FilesRaw = rest.Cluster_Schema<typeof rxapi.img, "post", "files">

type TransformTuple<Tuple extends readonly any[], T> = {
    [K in keyof Tuple]: T
}

export type SendXImgPost_FilesHMap = {
    [Field in keyof FilesRaw]: FilesRaw[Field] extends readonly any[] ? (
        TransformTuple<FilesRaw[Field], FileDataDef>
    ) : never
}

export type SendXImgPost_Files = {
    (): Promise<SendXImgPost_FilesHMap>
}

export type SendXImgPost_Result = (
    rest.Cluster_Result<typeof rxapi.img, "post">
)

export type SendXImgPost_Params = {
    readonly body: SendXImgPost_Body
    readonly files: SendXImgPost_Files
    readonly config?: SendConfig<SendXImgPost_Result>
}

export const sendx_img_post = async function(
    params: SendXImgPost_Params
): Promise<ApiResponse<SendXImgPost_Result>> {
    const url = new URL(`${cst.urlbase_api}/restx/img`)
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

    const request = res_new_json<SendXImgPost_Result>({
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
