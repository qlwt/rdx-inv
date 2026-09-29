export type ObjOverride<Src extends {}, Layer extends {}> = (
    & Omit<Src, keyof Layer>
    & Layer
)

export type ObjMutable<Src extends {}> = {
    -readonly [K in keyof Src]: Src[K]
}

export type ObjMutableDeep<Src extends {}> = {
    -readonly [K in keyof Src]: Src[K] extends object ? ObjMutableDeep<Src[K]> : Src[K]
}

export type ObjTemporary<Src extends {}> = {
    -readonly [K in keyof Src]?: Src[K]
}

export type ObjFinal<Src extends ObjTemporary<any>> = (
    Src extends ObjTemporary<infer Raw> ? Raw : never
)
