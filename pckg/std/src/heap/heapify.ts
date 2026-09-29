import { heap_node_left, heap_node_parent, heap_node_right } from "#src/heap/relations";
import type { Heap, HeapConfig } from "#src/heap/type/Heap";

export function heap_heapify_up<T>(heap: Heap<T>, config: HeapConfig<T>): void {
    let index_target = heap.length - 1

    while (index_target >= 1) {
        const index_parent = heap_node_parent(index_target)

        const node_target = heap[index_target]!
        const node_parent = heap[index_parent]!

        if (config.diff(node_target, node_parent) > 0) {
            heap[index_target] = node_parent
            heap[index_parent] = node_target
        } else {
            break
        }

        index_target = index_parent
    }
}

export function heap_heapify_down<T>(heap: Heap<T>, config: HeapConfig<T>): void {
    let index_target = 0

    for (; ;) {
        const index_left = heap_node_left(index_target)
        const index_right = heap_node_right(index_target)

        const node_target = heap[index_target]!

        if (index_right < heap.length) {
            const node_left = heap[index_left]!
            const node_right = heap[index_right]!

            if (config.diff(node_left, node_right) > 0) {
                if (config.diff(node_left, node_target) > 0) {
                    heap[index_left] = node_target
                    heap[index_target] = node_left

                    index_target = index_left

                    continue
                }

                break
            } else {
                if (config.diff(node_right, node_target) > 0) {
                    heap[index_right] = node_target
                    heap[index_target] = node_right

                    index_target = index_right

                    continue
                }

                break
            }

            continue
        }

        if (index_left < heap.length) {
            const node_left = heap[index_left]!

            if (config.diff(node_left, node_target) > 0) {
                heap[index_left] = node_target
                heap[index_target] = node_left

                index_target = index_left

                continue
            }

            break
        }

        break
    }
}
