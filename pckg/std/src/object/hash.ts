export const object_hash_stable = function (src: object): string {
    let hash = ""

    const key_list = Object.keys(src).sort()

    for (const key of key_list) {
        hash += `${JSON.stringify(key)} ${JSON.stringify(src[key as never])}`
    }

    return hash
}
