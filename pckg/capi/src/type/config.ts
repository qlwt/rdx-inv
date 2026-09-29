import type { ApiResponse_Events } from "#src/res/event"

export type SendConfig<Res> = {
    readonly abort_signal?: AbortSignal
    readonly events?: ApiResponse_Events<Res>
}
