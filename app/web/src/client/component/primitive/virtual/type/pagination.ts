export type EPVirtual_PaginationStatus = (
    | "idle"
    | "pending"
    | "fulfilled"
)

export type EPVirtual_Pagination = {
    readonly deps: any[]
    readonly threashhold: number
    readonly load: () => VoidFunction | void
    readonly status: EPVirtual_PaginationStatus
}
