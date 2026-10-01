export enum WSOEvent_Kind {
    CounterSet
}

export type WSOEventCounterSet = {
    readonly kind: WSOEvent_Kind.CounterSet
    readonly value: number
}

export type WSOEvent = (
    WSOEventCounterSet
)

export enum WSIEvent_Kind {
    CounterCheck
}

export type WSIEventCounterCheck = {
    readonly kind: WSIEvent_Kind.CounterCheck
}

export type WSIEvent = (
    WSIEventCounterCheck
)
