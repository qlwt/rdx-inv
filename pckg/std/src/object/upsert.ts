export const object_upsert = function <Src extends object, Key extends keyof Src>(
    src: Src, key: Key, value: Src[Key]
): Src[Key] {
    if (!(key in src)) {
        src[key] = value
    }

    return src[key]
}

export const object_upsert_lazy = function <Src extends object, Key extends keyof Src>(
    src: Src, key: Key, value: () => Src[Key]
): Src[Key] {
    if (!(key in src)) {
        src[key] = value()
    }

    return src[key]
}
