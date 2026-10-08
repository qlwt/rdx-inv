import type * as rest from "@ta/rest"

export enum GEvent_Kind {
    RemSlice = "Global__RemSlice"
}

export type GEvent_ARemSlice = {
    readonly slice: rest.DatabaseSlice
}
