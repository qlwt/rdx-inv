import type { Maybe } from "#src/maybe/type/maybe";

export type Array_NewMapF_Mapper<I, O> = {
    (input: I, index: number, src: readonly I[]): Maybe<O>
}

export const array_new_mapf = function <I, O>(src: readonly I[], mapper: Array_NewMapF_Mapper<I, O>): O[] {
    const result = new Array<O>(src.length)

    let j = 0

    for (let i = 0; i < src.length; ++i) {
        const src_item = src[i]!
        const next = mapper(src_item, i, src)

        if (next.kind) {
            result[j++] = next.value
        }
    }

    result.length = j

    return result
}
