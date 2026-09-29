import type { RefO } from "#src/ref/type/ref"
import * as r from "react"

export const useRefO = function <T>(ref: r.RefObject<T>): RefO<T> {
    return r.useCallback(() => ref.current, [ref])
}
