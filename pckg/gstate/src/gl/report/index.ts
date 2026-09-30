import * as rtk from "@reduxjs/toolkit"

export type GLReport_Message = {
    readonly kind: "info" | "error" | "success"
    readonly text: string
}

export type GLReport_State = {
    readonly msg_list: GLReport_Message[]
}

export type GLReport_AAdd = {
    readonly msg: GLReport_Message
}

export type GLReport_AAddConcrete = {
    readonly text: string
}

const slice = rtk.createSlice({
    name: "report",

    initialState: {
        msg_list: [],
    } satisfies GLReport_State as GLReport_State,

    reducers: {
        add: (state, action: rtk.PayloadAction<GLReport_AAdd>) => {
            return {
                ...state,

                msg_list: [...state.msg_list, action.payload.msg],
            }
        },

        add_error: (state, action: rtk.PayloadAction<GLReport_AAddConcrete>) => {
            return {
                ...state,

                msg_list: [
                    ...state.msg_list,

                    {
                        kind: "error",
                        text: action.payload.text
                    },
                ],
            }
        },

        add_info: (state, action: rtk.PayloadAction<GLReport_AAddConcrete>) => {
            return {
                ...state,

                msg_list: [
                    ...state.msg_list,

                    {
                        kind: "info",
                        text: action.payload.text
                    },
                ],
            }
        },

        add_success: (state, action: rtk.PayloadAction<GLReport_AAddConcrete>) => {
            return {
                ...state,

                msg_list: [
                    ...state.msg_list,

                    {
                        kind: "success",
                        text: action.payload.text
                    },
                ],
            }
        },
    },
})

export const gl_report = {
    reducer: slice.reducer,

    act: {
        ...slice.actions,
    },

    sel: {
        ...slice.selectors,
    },

    ut: {},
}
