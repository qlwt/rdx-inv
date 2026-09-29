export const map_slot = function <K, V>(map: Map<K, V>, key: NoInfer<K>, fallback_new: () => NoInfer<V>): V {
    if (map.has(key)) {
        return map.get(key)!
    }

    const value = fallback_new()

    map.set(key, value)

    return value
}

export const wmap_slot = function <K extends object, V>(map: WeakMap<K, V>, key: NoInfer<K>, fallback_new: () => NoInfer<V>): V {
    if (map.has(key)) {
        return map.get(key)!
    }

    const value = fallback_new()

    map.set(key, value)

    return value
}
