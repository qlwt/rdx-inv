export type EPVirtual_PaginationStatus = (
    | "idle"
    | "pending"
    | "fulfilled"
)

export type EPVirtual_Pagination = {
    readonly load: VoidFunction
    readonly threashhold: number
    readonly status: EPVirtual_PaginationStatus
}
