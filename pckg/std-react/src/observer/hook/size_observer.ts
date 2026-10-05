import type { RefO } from "#src/ref/type/ref"
import * as r from "react"

type Snapshot = {
    readonly element: HTMLElement
    readonly cleanup: VoidFunction
}

type Cache = {
    readonly width: number
    readonly height: number
}

export type UseSizeObserver_Params = {
    readonly refo_target: RefO<HTMLElement | null>

    readonly ignore?: {
        readonly width?: boolean
        readonly height?: boolean
    }
}

export const useSizeObserver = function(params: UseSizeObserver_Params) {
    const ref_cache = r.useRef<Cache | null>(null)
    const ref_snapshot = r.useRef<Snapshot | null>(null)

    const [size, size_set] = r.useState<DOMRect | null>(null)

    r.useEffect((): VoidFunction | void => {
        const target = params.refo_target()
        const snapshot = ref_snapshot.current

        if (target === null) {
            if (snapshot) {
                snapshot.cleanup()

                ref_snapshot.current = null
            }

            size_set(null)
            ref_cache.current = null

            return
        }

        if (snapshot) {
            if (snapshot.element === target) {
                return
            } else {
                snapshot.cleanup()
            }
        }

        {
            const observer = new ResizeObserver(() => {
                const rect = target.getBoundingClientRect()
                const cache = ref_cache.current

                if (!cache) {
                    size_set(rect)
                    ref_cache.current = { width: rect.width, height: rect.height, }

                    return
                }

                if (!params.ignore?.width && rect.width !== cache.width) {
                    size_set(rect)
                    ref_cache.current = { width: rect.width, height: rect.height, }

                    return
                }

                if (!params.ignore?.height && rect.height !== cache.height) {
                    size_set(rect)
                    ref_cache.current = { width: rect.width, height: rect.height, }

                    return
                }
            })

            ref_snapshot.current = {
                element: target,
                cleanup: () => { observer.disconnect() },
            }

            observer.observe(target)
        }
    }, [params.refo_target, params.ignore?.width, params.ignore?.height])

    return size
}
