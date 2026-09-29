import { heap_insert, heap_shift } from "#src/heap/insert"
import type { Heap, HeapConfig } from "#src/heap/type/Heap"
import { heap_valid } from "#src/heap/valid"
import { test, expect } from "bun:test"

const config_number = (s: number): HeapConfig<number> => ({
    diff: (a: number, b: number) => s * (a - b)
})

test("heap_insert.min.insert", () => {
    const minheap: Heap<number> = []
    const minheap_config = config_number(-1)

    heap_insert(minheap, 10, minheap_config)
    heap_insert(minheap, 5, minheap_config)
    heap_insert(minheap, 0, minheap_config)
    heap_insert(minheap, 3, minheap_config)
    heap_insert(minheap, 5, minheap_config)
    heap_insert(minheap, 9, minheap_config)

    expect(heap_valid(minheap, minheap_config)).toEqual(true)
})

test("heap_insert.min.pop", () => {
    const minheap: Heap<number> = []
    const minheap_config = config_number(-1)

    heap_insert(minheap, 10, minheap_config)
    heap_insert(minheap, 5, minheap_config)
    heap_insert(minheap, 0, minheap_config)
    heap_insert(minheap, 3, minheap_config)
    heap_insert(minheap, 5, minheap_config)
    heap_insert(minheap, 9, minheap_config)

    heap_shift(minheap, minheap_config)
    heap_shift(minheap, minheap_config)

    expect(heap_valid(minheap, minheap_config)).toEqual(true)
})

test("heap_insert.min.insert", () => {
    const maxheap: Heap<number> = []
    const maxheap_config = config_number(1)

    heap_insert(maxheap, 10, maxheap_config)
    heap_insert(maxheap, 5, maxheap_config)
    heap_insert(maxheap, 0, maxheap_config)
    heap_insert(maxheap, 3, maxheap_config)
    heap_insert(maxheap, 5, maxheap_config)
    heap_insert(maxheap, 9, maxheap_config)

    expect(heap_valid(maxheap, maxheap_config)).toEqual(true)
})

test("heap_insert.min.pop", () => {
    const maxheap: Heap<number> = []
    const maxheap_config = config_number(1)

    heap_insert(maxheap, 10, maxheap_config)
    heap_insert(maxheap, 5, maxheap_config)
    heap_insert(maxheap, 0, maxheap_config)
    heap_insert(maxheap, 3, maxheap_config)
    heap_insert(maxheap, 5, maxheap_config)
    heap_insert(maxheap, 9, maxheap_config)

    heap_shift(maxheap, maxheap_config)
    heap_shift(maxheap, maxheap_config)

    expect(heap_valid(maxheap, maxheap_config)).toEqual(true)
})
