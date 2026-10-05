import type { RefI } from "#src/ref/type/ref"
import * as r from "react"

export const useRefI = function <T>(ref: r.RefObject<T>): RefI<T> {
    return r.useCallback(element => { ref.current = element }, [ref])
}
