export type RemLogPost = {
    req_id: string
    node_id: string
}

export type RemLogDelete = {
    req_id: string
}

export type RemLogPatch<Node extends object> = {
    name: string
    req_id: string
    data: Partial<Node>
}

export type RemLogNode<Node extends object> = {
    post: RemLogPost | null

    del: RemLogDelete[]
    patch: RemLogPatch<Node>[]
}

export type RemLog<Node extends object> = {
    [K in string]: RemLogNode<Node>
}
