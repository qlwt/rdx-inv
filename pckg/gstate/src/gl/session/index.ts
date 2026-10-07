import type { GLSession_ASet } from "#src/gl/session/type/action"
import type { GLSession_State } from "#src/gl/session/type/state"
import * as rtk from "@reduxjs/toolkit"

const slice = rtk.createSlice({
    name: "session",

    initialState: {
        counter: null,
    } satisfies GLSession_State as GLSession_State,

    reducers: {
        counter_set: (state, action: rtk.PayloadAction<GLSession_ASet>) => {
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
