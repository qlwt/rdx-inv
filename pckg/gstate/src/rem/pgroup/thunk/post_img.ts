import * as rtk from "@reduxjs/toolkit"
import * as capi from "@ta/capi"

export type RemPGroup__TPostImg_Params = (
    & Omit<capi.SendXPGroupPostImg_Params, "files">
    & {
        readonly files_raw: capi.SendXPGroupPostImg_FilesHMap
        readonly files_process: (files_raw: capi.SendXPGroupPostImg_FilesHMap) => Promise<capi.SendXPGroupPostImg_FilesHMap>
    }
)

export const rem_pgroup__thunk_post_img = rtk.createAsyncThunk(
    "pgroup/post_img",
    async (params: RemPGroup__TPostImg_Params, api) => {
        return capi.sendx_pgroup_post_img({
            ...params,

            files: () => {
                return params.files_process(params.files_raw)
            },
        })
    }
)
