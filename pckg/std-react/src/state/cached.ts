import * as r from "react"

export type UseStateCached_InitApi_Old<T> = Readonly<{
    value: T
    raw: string
}>

export type UseStateCached_InitGetter<T> = {
    (api: UseStateCached_InitApi<T>): T
}

export type UseStateCached_InitApi<T> = Readonly<{
    old: null | UseStateCached_InitApi_Old<T>
}>

const parse = function <T>(raw: string | null): UseStateCached_InitApi_Old<T> | null {
    if (raw === null) {
        return null
    }

    try {
        const parsed = JSON.parse(raw)

        return {
            raw,
            value: parsed,
        }
    } catch (e) {
        return null
    }
}

const next_new = function <T>(getter: T | ((v: T) => T), old: T): T {
    if (typeof getter === "function") {
        return (getter as ((v: T) => T))(old)
    }

    return getter
}

export const useStateCached = function <T>(key: string, init: T | UseStateCached_InitGetter<T>) {
    const [state, state_set] = r.useState(() => {
        const old = parse<T>(sessionStorage.getItem(`reactstatecache:${key}`))

        if (typeof init === "function") {
            return (init as UseStateCached_InitGetter<T>)({
                old,
            })
        }

        if (old) {
            return old.value
        }

        return init
    })

    return [state, (now_state => {
        state_set(old => {
            const next = next_new(now_state, old)

            if (next !== old) {
                sessionStorage.setItem(`reactstatecache:${key}`, JSON.stringify(next))
            }

            return next
        })
    }) satisfies typeof state_set] as const
}
