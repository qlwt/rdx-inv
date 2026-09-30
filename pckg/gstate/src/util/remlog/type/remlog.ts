export type RemLogPost = {
    req_id: string
    node_id: string
}

export type RemLogDelete = {
    req_id: string
}

export type RemLogPatch<Node extends object> = {
    req_id: string
    data: Partial<Node>
}

export type RemLogNode<Node extends object> = {
    post: RemLogPost | null
    del: RemLogDelete | null
    patch: RemLogPatch<Node> | null
}

export type RemLog<Node extends object> = {
    [K in string]: RemLogNode<Node>
}
