import { heap_node_left, heap_node_right } from "#src/heap/relations";
import type { Heap, HeapConfig } from "#src/heap/type/Heap";

export function heap_valid<T>(heap: Heap<T>, config: HeapConfig<T>): boolean {
    for (let index_target = 0; index_target < heap.length; ++index_target) {
        const index_left = heap_node_left(index_target)
        const index_right = heap_node_right(index_target)

        const node_target = heap[index_target]!

        if (index_left < heap.length) {
            const node_left = heap[index_left]!

            if (config.diff(node_left, node_target) > 0) {
                return false
            }
        }

        if (index_right < heap.length) {
            const node_right = heap[index_left]!

            if (config.diff(node_right, node_target) > 0) {
                return false
            }
        }
    }

    return true
}
