import * as rtk from "@reduxjs/toolkit"

export type GLReport_State = {
    readonly counter: number | null
}

export type GLReport_ASet = {
    readonly counter: number
}

const slice = rtk.createSlice({
    name: "session",

    initialState: {
        counter: null,
    } satisfies GLReport_State as GLReport_State,

    reducers: {
        counter_set: (state, action: rtk.PayloadAction<GLReport_ASet>) => {
            return {
                ...state,

                counter: action.payload.counter,
            }
        },
    },

    selectors: {
        counter: state => {
            return state.counter
        },
    },
})

export const gl_session = {
    reducer: slice.reducer,

    act: {
        ...slice.actions,
    },

    sel: {
        ...slice.selectors,
    },
}
