export type Fn<Return, Params extends readonly any[] = []> = {
    (...params: Params): Return
}
