import * as r from "react"

export const useConstLazy = function <T>(value: () => T): T {
    return r.useMemo(value, [])
}
