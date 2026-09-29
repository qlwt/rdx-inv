export const abort_signal_new_merge = function (src: (AbortSignal | null | undefined)[]): AbortSignal {
    return AbortSignal.any(src.filter(n => Boolean(n)) as AbortSignal[])
}
