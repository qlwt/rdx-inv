import type { Fn } from "#src/fn/type/fn"

export type FnBatcherVoid = Fn<void, [cb: FnVoid]>

export type FnBatcher<T> = Fn<T, [cb: Fn<T, []>]>

export type FnVoid<Params extends any[] = []> = Fn<void, Params>

export type FnGetter<T> = Fn<T, []>

export type FnDiff<T> = Fn<number, [left: T, right: T]>

export type FnComparator<T> = Fn<boolean, [left: T, right: T]>

export type FnPredicate<T> = Fn<boolean, [src: T]>

export type FnValidator<TSrc, TNext extends TSrc> = (src: TSrc) => src is TNext

export type FnOutTransformer<T, T_O> = Fn<T_O, [in_raw: T]>

export type FnInTransformer<T, T_O> = Fn<T, [in_transformed: T_O]>

export type FnSetterStateles<T> = Fn<void, [now_state: T]>

export type FnSetterStateful<T> = Fn<void, [input: T | Fn<T, [old_state: T]>]>
