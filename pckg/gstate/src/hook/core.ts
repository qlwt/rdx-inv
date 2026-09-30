import type { Dispatch, State } from "#src/store"
import * as rtkr from "react-redux"
import * as r from "react"

export const useSelect = rtkr.useSelector.withTypes<State>()
export const useDispatch = rtkr.useDispatch.withTypes<Dispatch>()

export const useSelectCached = function <T>(cb: (state: State) => T, deps: unknown[]) {
    return useSelect(r.useCallback(cb, deps))
}
