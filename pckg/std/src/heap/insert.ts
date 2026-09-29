import { heap_heapify_down, heap_heapify_up } from "#src/heap/heapify";
import type { Heap, HeapConfig } from "#src/heap/type/Heap";

export function heap_insert<T>(heap: Heap<T>, item: T, config: HeapConfig<T>): void {
    heap.push(item)

    heap_heapify_up(heap, config)
}

export function heap_shift<T>(heap: Heap<T>, config: HeapConfig<T>): void {
    heap[0] = heap[heap.length - 1]!

    heap.pop()

    heap_heapify_down(heap, config)
}
