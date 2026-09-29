import * as r from "react"

type Snapshot = {
    readonly element: HTMLElement
    readonly cleanup: VoidFunction
}

export const useSizeObserver = function(ref_target: () => HTMLElement | null) {
    const ref_snapshot = r.useRef<Snapshot | null>(null)

    const [size, size_set] = r.useState<DOMRect | null>(null)

    r.useEffect((): VoidFunction | void => {
        const target = ref_target()
        const snapshot = ref_snapshot.current

        if (target === null) {
            if (snapshot) {
                snapshot.cleanup()

                ref_snapshot.current = null
            }

            size_set(null)

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
                size_set(target.getBoundingClientRect())
            })

            ref_snapshot.current = {
                element: target,
                cleanup: () => { observer.disconnect() },
            }

            observer.observe(target)
        }
    })

    return size
}
