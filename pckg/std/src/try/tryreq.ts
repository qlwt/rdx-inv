type TryReqO = {
    <T>(get: () => T): Promise<T | null>
    <T, F>(get: () => T, fallback: () => F): Promise<T | F>
    <T, F>(get: () => T, fallback?: () => F): Promise<T | F | null>
}

export const tryreqo: TryReqO = async function <T, F>(get: () => Promise<T>, fallback?: () => F): Promise<T | F | null> {
    try {
        return await get()
    } catch (error) {
        console.error("TRYREQO ERROR", error)

        return fallback?.() || null
    }
}

export type TryReq_Return<T> = (
    | {
        readonly success: true
        readonly output: T
    }
    | {
        readonly success: false
    }
)

export const tryreq = async function <T>(get: () => Promise<T>): Promise<TryReq_Return<T>> {
    try {
        return { success: true, output: await get() }
    } catch (error) {
        console.error(error)

        return { success: false }
    }
}
