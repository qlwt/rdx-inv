export type MaybeNone = {
    readonly kind: false
}

export type MaybeNoneMut = {
    kind: false
}

export type MaybeSome<T> = {
    readonly kind: true
    readonly value: T
}

export type MaybeSomeMut<T> = {
    kind: true
    value: T
}

export type Maybe<T> = (
    | MaybeNone
    | MaybeSome<T>
)

export type MaybeMut<T> = (
    | MaybeNoneMut
    | MaybeSomeMut<T>
)
