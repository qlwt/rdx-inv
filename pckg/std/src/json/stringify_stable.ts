export const json_stringify_stable = function(value: unknown): string {
    if (typeof value !== "object" || value === null) {
        return JSON.stringify(value)
    }

    if (Array.isArray(value)) {
        return `[${value.map(child => json_stringify_stable(child)).join(", ")}]`
    }

    const keys = Object.keys(value).sort()
    const pairs = keys.map(key => `${JSON.stringify(key)}: ${json_stringify_stable(value[key as keyof typeof value])}`)

    return `{ ${pairs.join(", ")} }`
}
