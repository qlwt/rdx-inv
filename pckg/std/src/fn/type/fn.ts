export type Fn<Return, Params extends any[] = []> = {
    (...params: Params): Return
}
