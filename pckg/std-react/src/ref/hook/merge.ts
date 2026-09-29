import type { RefI } from "#src/ref/type/ref"
import { ref_use } from "#src/ref/util/use"
import * as r from "react"

export const useRefMerge = function <T>(...refs: r.Ref<T>[]): RefI<T> {
    return r.useCallback((value: T) => {
        for (const ref of refs) {
            ref_use(ref, value)
        }
    }, refs)
}
