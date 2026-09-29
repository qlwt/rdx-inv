export type HeapConfig<T> = {
    readonly diff: (a: T, b: T) => number
}

export type Heap<T = any> = T[]
