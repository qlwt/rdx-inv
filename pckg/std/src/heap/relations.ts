export function heap_node_left(index: number): number {
    return (index << 1) + 1
}

export function heap_node_right(index: number): number {
    return (index << 1) + 2
}

export function heap_node_parent(index: number): number {
    return (index - 1) >>> 1
}
