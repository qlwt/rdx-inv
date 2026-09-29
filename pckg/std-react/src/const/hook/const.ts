import * as r from "react"

export const useConst = function <T>(value: T): T {
    return r.useMemo(() => value, [])
}
