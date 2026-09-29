type TryGetO = {
    <T>(get: () => T): T | null
    <T, F>(get: () => T, fallback: () => F): T | F
    <T, F>(get: () => T, fallback?: () => F): T | F | null
}

export const trygeto: TryGetO = function <T, F>(getter: () => T, fallback?: () => F): T | F | null {
    try {
        return getter()
    } catch (error) {
        console.error(error)

        return fallback?.() || null
    }
}

export type TryGet_Return<T> = (
    | {
        readonly success: true
        readonly output: T
    }
    | {
        readonly success: false
    }
)

export const tryget = function <T>(get: () => T): TryGet_Return<T> {
    try {
        return { success: true, output: get() }
    } catch (error) {
        console.error(error)

        return { success: false }
    }
}
